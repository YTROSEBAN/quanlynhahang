from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from routers import trangchu, ban, monan, hoadon, nhanvien

app = FastAPI()
app.mount("/static", StaticFiles(directory="static"), name="static")

app.include_router(trangchu.router)
app.include_router(ban.router)
app.include_router(monan.router)
app.include_router(hoadon.router)
app.include_router(nhanvien.router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
