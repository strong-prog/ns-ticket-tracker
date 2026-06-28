def test_stats_empty(client):
    """Stats on empty database returns zeros and empty dicts."""
    resp = client.get("/tickets/stats")
    assert resp.status_code == 200
    data = resp.json()
    assert data["total"] == 0
    assert data["by_status"] == {}
    assert data["by_priority"] == {}


def test_stats_with_tickets(client):
    """Stats correctly aggregate tickets across statuses and priorities."""
    client.post("/tickets", json={"title": "Ticket 1", "priority": "low"})
    client.post("/tickets", json={"title": "Ticket 2", "priority": "normal"})
    client.post("/tickets", json={"title": "Ticket 3", "priority": "high"})
    # Move ticket 2 from new to in_progress
    client.patch("/tickets/2/status", json={"status": "in_progress"})

    resp = client.get("/tickets/stats")
    assert resp.status_code == 200
    data = resp.json()
    assert data["total"] == 3
    assert data["by_status"] == {"new": 2, "in_progress": 1}
    assert data["by_priority"] == {"low": 1, "normal": 1, "high": 1}


def test_stats_after_delete(client, admin_auth_header):
    """Stats reflect deletions."""
    client.post("/tickets", json={"title": "Ticket 1", "priority": "low"})
    client.post("/tickets", json={"title": "Ticket 2", "priority": "normal"})

    resp = client.get("/tickets/stats")
    assert resp.json()["total"] == 2

    client.delete("/tickets/1", headers=admin_auth_header)

    resp = client.get("/tickets/stats")
    assert resp.json()["total"] == 1
    assert resp.json()["by_priority"] == {"normal": 1}


def test_stats_independent_of_list_query(client):
    """Stats endpoint is not affected by query parameters."""
    for i in range(3):
        client.post("/tickets", json={"title": f"Ticket {i}", "priority": "normal"})

    resp = client.get("/tickets/stats", params={"status": "done", "search": "nothing"})
    assert resp.status_code == 200
    # Query params don't filter stats — they're ignored
    assert resp.json()["total"] == 3
