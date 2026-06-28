def test_create_ticket_extra_fields_rejected(client):
    resp = client.post(
        "/tickets",
        json={"title": "Test", "priority": "normal", "foo": "bar"},
    )
    assert resp.status_code == 422


def test_update_status_extra_fields_rejected(client):
    client.post("/tickets", json={"title": "Ticket 1", "priority": "normal"})
    resp = client.patch("/tickets/1/status", json={"status": "new", "foo": "bar"})
    assert resp.status_code == 422


def test_create_ticket_valid(client):
    resp = client.post("/tickets", json={"title": "Test ticket", "priority": "normal"})
    assert resp.status_code == 201
    data = resp.json()
    assert data["id"] == 1
    assert data["title"] == "Test ticket"
    assert data["status"] == "new"
    assert data["priority"] == "normal"
    assert data["description"] is None


def test_create_ticket_with_description(client):
    resp = client.post(
        "/tickets",
        json={"title": "With desc", "description": "A description", "priority": "high"},
    )
    assert resp.status_code == 201
    assert resp.json()["description"] == "A description"


def test_create_ticket_title_too_short(client):
    resp = client.post("/tickets", json={"title": "ab", "priority": "low"})
    assert resp.status_code == 422


def test_create_ticket_title_too_long(client):
    resp = client.post("/tickets", json={"title": "a" * 121, "priority": "low"})
    assert resp.status_code == 422


def test_create_ticket_blank_title(client):
    resp = client.post("/tickets", json={"title": "   ", "priority": "low"})
    assert resp.status_code == 422


def test_create_ticket_invalid_priority(client):
    resp = client.post("/tickets", json={"title": "Test", "priority": "critical"})
    assert resp.status_code == 422


def test_create_ticket_default_priority(client):
    resp = client.post("/tickets", json={"title": "No priority"})
    assert resp.status_code == 201
    assert resp.json()["priority"] == "normal"


def test_list_tickets_empty(client):
    resp = client.get("/tickets")
    assert resp.status_code == 200
    data = resp.json()
    assert data["items"] == []
    assert data["total"] == 0
    assert data["pages"] == 0


def test_list_tickets_with_data(client):
    for i in range(3):
        client.post("/tickets", json={"title": f"Ticket {i}", "priority": "normal"})
    resp = client.get("/tickets")
    assert resp.status_code == 200
    data = resp.json()
    assert len(data["items"]) == 3
    assert data["total"] == 3
    assert data["pages"] == 1


def test_list_tickets_filter_status(client):
    client.post("/tickets", json={"title": "Ticket 1", "priority": "normal"})
    client.post("/tickets", json={"title": "Ticket 2", "priority": "normal"})
    # Move T2 to done
    client.patch("/tickets/2/status", json={"status": "done"})

    resp = client.get("/tickets", params={"status": "done"})
    data = resp.json()
    assert len(data["items"]) == 1
    assert data["items"][0]["id"] == 2


def test_list_tickets_filter_priority(client):
    client.post("/tickets", json={"title": "Low", "priority": "low"})
    client.post("/tickets", json={"title": "High", "priority": "high"})

    resp = client.get("/tickets", params={"priority": "high"})
    data = resp.json()
    assert len(data["items"]) == 1
    assert data["items"][0]["priority"] == "high"


def test_list_tickets_search(client):
    client.post("/tickets", json={"title": "Server issue", "priority": "normal"})
    client.post(
        "/tickets",
        json={"title": "Network", "description": "Server is down", "priority": "low"},
    )

    resp = client.get("/tickets", params={"search": "Server"})
    data = resp.json()
    assert len(data["items"]) == 2


def test_list_tickets_pagination(client):
    for i in range(5):
        client.post("/tickets", json={"title": f"Ticket {i}", "priority": "normal"})

    resp = client.get("/tickets", params={"page": 1, "limit": 2})
    data = resp.json()
    assert len(data["items"]) == 2
    assert data["total"] == 5
    assert data["pages"] == 3

    resp = client.get("/tickets", params={"page": 2, "limit": 2})
    data = resp.json()
    assert len(data["items"]) == 2

    resp = client.get("/tickets", params={"page": 3, "limit": 2})
    data = resp.json()
    assert len(data["items"]) == 1


def test_update_status_valid(client):
    client.post("/tickets", json={"title": "Ticket 1", "priority": "normal"})
    resp = client.patch("/tickets/1/status", json={"status": "in_progress"})
    assert resp.status_code == 200
    assert resp.json()["status"] == "in_progress"


def test_update_status_done_cannot_change(client):
    client.post("/tickets", json={"title": "Ticket 1", "priority": "normal"})
    client.patch("/tickets/1/status", json={"status": "done"})
    resp = client.patch("/tickets/1/status", json={"status": "new"})
    assert resp.status_code == 409
    assert "done" in resp.json()["detail"].lower()


def test_update_status_not_found(client):
    resp = client.patch("/tickets/999/status", json={"status": "in_progress"})
    assert resp.status_code == 404


def test_delete_ticket_by_admin(client, admin_auth_header):
    client.post("/tickets", json={"title": "Ticket 1", "priority": "normal"})
    resp = client.delete("/tickets/1", headers=admin_auth_header)
    assert resp.status_code == 204

    # Verify deleted
    resp = client.get("/tickets")
    assert resp.json()["total"] == 0


def test_delete_ticket_without_auth(client):
    client.post("/tickets", json={"title": "Ticket 1", "priority": "normal"})
    resp = client.delete("/tickets/1")
    assert resp.status_code == 401


def test_delete_ticket_wrong_auth(client):
    client.post("/tickets", json={"title": "Ticket 1", "priority": "normal"})
    import base64

    creds = base64.b64encode(b"wrong:wrong").decode()
    resp = client.delete("/tickets/1", headers={"Authorization": f"Basic {creds}"})
    assert resp.status_code == 401


def test_delete_done_ticket(client, admin_auth_header):
    client.post("/tickets", json={"title": "Ticket 1", "priority": "normal"})
    client.patch("/tickets/1/status", json={"status": "done"})
    resp = client.delete("/tickets/1", headers=admin_auth_header)
    assert resp.status_code == 409


def test_delete_not_found(client, admin_auth_header):
    resp = client.delete("/tickets/999", headers=admin_auth_header)
    assert resp.status_code == 404
