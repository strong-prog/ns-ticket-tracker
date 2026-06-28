def test_login_valid(client):
    import base64

    creds = base64.b64encode(b"admin:admin").decode()
    resp = client.post("/auth/login", headers={"Authorization": f"Basic {creds}"})
    assert resp.status_code == 200
    assert "admin" in resp.json()["message"]


def test_login_invalid(client):
    import base64

    creds = base64.b64encode(b"admin:wrong").decode()
    resp = client.post("/auth/login", headers={"Authorization": f"Basic {creds}"})
    assert resp.status_code == 401


def test_login_no_auth(client):
    resp = client.post("/auth/login")
    assert resp.status_code == 401


def test_health_check(client):
    resp = client.get("/health")
    assert resp.status_code == 200
    assert resp.json() == {"status": "ok"}


def test_global_exception_handler_registered():
    from app.main import create_app

    app = create_app()
    assert Exception in app.exception_handlers
