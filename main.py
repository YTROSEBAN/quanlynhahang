import os

from fastapi import FastAPI
from fastapi.responses import FileResponse, RedirectResponse
from fastapi.staticfiles import StaticFiles
from routers import trangchu, ban, monan, hoadon, nhanvien

app = FastAPI()
app.mount("/static", StaticFiles(directory="static"), name="static")


@app.middleware("http")
async def no_cache_static(request, call_next):
    """Không cache gì cả: sửa giao diện phải thấy ngay, không cần Ctrl+F5.
    Nếu không trình duyệt giữ bản cũ thì mọi chỉnh sửa trông như không có tác dụng."""
    response = await call_next(request)
    path = request.url.path
    is_asset = (
        path.startswith("/static/")
        or path.endswith((".css", ".js", ".html", ".ico", ".svg", ".webp"))
        or path.startswith("/kage/")
        or path.startswith("/landing-pages/")
    )
    if is_asset or "text/html" in response.headers.get("content-type", ""):
        response.headers["Cache-Control"] = "no-store, no-cache, must-revalidate, max-age=0"
        response.headers["Pragma"] = "no-cache"
    return response

app.include_router(trangchu.router)
app.include_router(ban.router)
app.include_router(monan.router)
app.include_router(hoadon.router)
app.include_router(nhanvien.router)

# ---------------------------------------------------------------------------
# ThreeUI — KageLandingPage (MIT).
# Vite build output lives outside the project tree, so the whole /kage prefix is
# mounted from its absolute location. Built with base "./" so the page resolves
# its own assets relative to the mount point.
# ---------------------------------------------------------------------------
KAGE_DIST = r"A:\threeui-kage\app\dist"
KAGE_PAGES = os.path.join(KAGE_DIST, "landing-pages")

if os.path.isdir(KAGE_DIST):
    # The Kage scene is embedded in the homepage as a sticky stage, so the
    # standalone React shell is no longer a separate destination. Redirect the
    # old prefix to the homepage instead of serving a second copy of the page.
    @app.get("/kage")
    @app.get("/kage/")
    def kage_to_home():
        return RedirectResponse(url="/", status_code=302)

    # KageLandingPage hardcodes its frame source as "/landing-pages/kage.html",
    # an absolute path from the site root rather than a path relative to the
    # React bundle. Serving the same directory again at the root is what makes
    # that authored URL resolve. Both mounts point at one directory on disk, so
    # kage.html stays byte-exact and no copy is made.
    if os.path.isdir(KAGE_PAGES):
        app.mount(
            "/landing-pages",
            StaticFiles(directory=KAGE_PAGES, html=True),
            name="kage-landing-pages",
        )
else:  # pragma: no cover - only when the Vite build has not been run
    @app.get("/kage")
    def kage_missing():
        return RedirectResponse(url="/", status_code=302)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
