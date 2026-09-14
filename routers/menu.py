from fastapi import APIRouter, Request, UploadFile, File, Form, Depends
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.templating import Jinja2Templates
from sqlalchemy import text
from database.db import engine
from pydantic import BaseModel
from typing import Optional
from datetime import datetime
import shutil
import os

router = APIRouter()
templates = Jinja2Templates(directory="templates")

def create_orders_table():
    with engine.connect() as conn:
        conn.execute(text("""
            CREATE TABLE IF NOT EXISTS orders (
                id INT AUTO_INCREMENT PRIMARY KEY,
                menu_id INT NOT NULL,
                menu_name VARCHAR(255) NOT NULL,
                menu_price INT NOT NULL,
                menu_size INT NOT NULL,
                customer_name VARCHAR(255) NOT NULL,
                phone VARCHAR(20) NOT NULL,
                address TEXT NOT NULL,
                quantity INT DEFAULT 1,
                status VARCHAR(50) DEFAULT 'Chờ xử lý',
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        """))
        conn.commit()

try:
    create_orders_table()
except:
    pass

class MenuCreate(BaseModel):
    ID: int
    Name: str
    price: int
    Size: int
    Image: str
    type: str

class OrderCreate(BaseModel):
    menu_id: int
    customer_name: str
    phone: str
    address: str
    quantity: int = 1

@router.get("/", response_class=HTMLResponse)
def home(request: Request):
    return templates.TemplateResponse(request, "index.html")

@router.get("/menu/add", response_class=HTMLResponse)
def add_menu_form(request: Request):
    return templates.TemplateResponse(request, "add.html")

@router.post("/menu/add")
async def add_menu(
    request: Request,
    Name: str = Form(...),
    price: int = Form(...),
    Size: int = Form(...),
    type: str = Form(...),
    Image: UploadFile = File(None)
):
    image_path = ""
    if Image and Image.filename:
        ext = os.path.splitext(Image.filename)[1]
        filename = f"{Name.replace(' ', '_')}{ext}"
        filepath = os.path.join("static", "uploads", filename)
        with open(filepath, "wb") as f:
            shutil.copyfileobj(Image.file, f)
        image_path = f"/static/uploads/{filename}"

    try:
        with engine.connect() as conn:
            conn.execute(
                text("INSERT INTO menu (Name, Price, Size, Image, Type) VALUES (:name, :price, :size, :image, :type)"),
                {"name": Name, "price": price, "size": Size, "image": image_path, "type": type}
            )
            conn.commit()
        return RedirectResponse(url="/", status_code=303)
    except Exception as e:
        return templates.TemplateResponse(request, "add.html", {"error": str(e)})

@router.get("/api/menu")
def api_menu():
    try:
        with engine.connect() as conn:
            result = conn.execute(text("SELECT * FROM menu"))
            items = [dict(row._mapping) for row in result]
        return items
    except Exception as e:
        return {"error": str(e), "items": []}

@router.post("/api/upload")
async def api_upload(image: UploadFile = File(...)):
    ext = os.path.splitext(image.filename)[1]
    filename = f"upload_{os.urandom(4).hex()}{ext}"
    filepath = os.path.join("static", "uploads", filename)
    with open(filepath, "wb") as f:
        shutil.copyfileobj(image.file, f)
    return {"url": f"/static/uploads/{filename}"}

@router.post("/api/menu")
async def api_add_menu(data: MenuCreate):
    try:
        with engine.connect() as conn:
            conn.execute(
                text("INSERT INTO menu (Name, Price, Size, Image, Type) VALUES (:name, :price, :size, :image, :type)"),
                {"name": data.Name, "price": data.price, "size": data.Size, "image": data.Image, "type": data.type}
            )
            conn.commit()
        return {"ok": True}
    except Exception as e:
        return {"ok": False, "error": str(e)}

@router.get("/about", response_class=HTMLResponse)
def about(request: Request):
    return templates.TemplateResponse(request, "about.html")

@router.get("/menu/list", response_class=HTMLResponse)
def list_menu(request: Request):
    try:
        with engine.connect() as conn:
            result = conn.execute(text("SELECT * FROM menu"))
            items = result.fetchall()
        return templates.TemplateResponse(request, "menu_list.html", {"items": items})
    except Exception as e:
        return templates.TemplateResponse(request, "menu_list.html", {"error": str(e), "items": []})

@router.get("/menu/edit/{id}", response_class=HTMLResponse)
def edit_menu_form(request: Request, id: int):
    try:
        with engine.connect() as conn:
            result = conn.execute(text("SELECT * FROM menu WHERE ID = :id"), {"id": id})
            item = result.fetchone()
        if item is None:
            return RedirectResponse(url="/menu/list", status_code=303)
        return templates.TemplateResponse(request, "edit.html", {"item": item})
    except Exception as e:
        return RedirectResponse(url="/menu/list", status_code=303)

@router.post("/menu/edit/{id}")
async def edit_menu(
    request: Request,
    id: int,
    Name: str = Form(...),
    price: int = Form(...),
    Size: int = Form(...),
    type: str = Form(...),
    Image: UploadFile = File(None)
):
    image_path = None
    if Image and Image.filename:
        ext = os.path.splitext(Image.filename)[1]
        filename = f"{Name.replace(' ', '_')}{ext}"
        filepath = os.path.join("static", "uploads", filename)
        with open(filepath, "wb") as f:
            shutil.copyfileobj(Image.file, f)
        image_path = f"/static/uploads/{filename}"

    try:
        with engine.connect() as conn:
            if image_path:
                conn.execute(
                    text("UPDATE menu SET Name=:name, Price=:price, Size=:size, Image=:image, Type=:type WHERE ID=:id"),
                    {"name": Name, "price": price, "size": Size, "image": image_path, "type": type, "id": id}
                )
            else:
                conn.execute(
                    text("UPDATE menu SET Name=:name, Price=:price, Size=:size, Type=:type WHERE ID=:id"),
                    {"name": Name, "price": price, "size": Size, "type": type, "id": id}
                )
            conn.commit()
        return RedirectResponse(url="/menu/list", status_code=303)
    except Exception as e:
        return RedirectResponse(url="/menu/list", status_code=303)

@router.get("/menu/delete/{id}")
def delete_menu(id: int):
    try:
        with engine.connect() as conn:
            conn.execute(text("DELETE FROM menu WHERE ID = :id"), {"id": id})
            conn.commit()
    except Exception as e:
        pass
    return RedirectResponse(url="/menu/list", status_code=303)

@router.get("/order/{id}", response_class=HTMLResponse)
def order_form(request: Request, id: int):
    try:
        with engine.connect() as conn:
            result = conn.execute(text("SELECT * FROM menu WHERE ID = :id"), {"id": id})
            item = result.fetchone()
        if item is None:
            return RedirectResponse(url="/", status_code=303)
        return templates.TemplateResponse(request, "order.html", {"item": item})
    except Exception as e:
        return RedirectResponse(url="/", status_code=303)

@router.post("/order/{id}")
async def place_order(
    request: Request,
    id: int,
    customer_name: str = Form(...),
    phone: str = Form(...),
    address: str = Form(...),
    quantity: int = Form(1)
):
    try:
        with engine.connect() as conn:
            result = conn.execute(text("SELECT * FROM menu WHERE ID = :id"), {"id": id})
            item = result.fetchone()
            if item is None:
                return RedirectResponse(url="/", status_code=303)
            conn.execute(
                text("INSERT INTO orders (menu_id, menu_name, menu_price, menu_size, customer_name, phone, address, quantity) VALUES (:menu_id, :menu_name, :menu_price, :menu_size, :customer_name, :phone, :address, :quantity)"),
                {"menu_id": item.ID, "menu_name": item.Name, "menu_price": item.Price, "menu_size": item.Size, "customer_name": customer_name, "phone": phone, "address": address, "quantity": quantity}
            )
            conn.commit()
        return templates.TemplateResponse(request, "order_success.html", {"item": item, "quantity": quantity, "customer_name": customer_name})
    except Exception as e:
        return RedirectResponse(url=f"/order/{id}", status_code=303)

@router.get("/orders", response_class=HTMLResponse)
def list_orders(request: Request):
    try:
        with engine.connect() as conn:
            result = conn.execute(text("SELECT * FROM orders ORDER BY created_at DESC"))
            items = result.fetchall()
        return templates.TemplateResponse(request, "orders.html", {"items": items})
    except Exception as e:
        return templates.TemplateResponse(request, "orders.html", {"error": str(e), "items": []})

@router.post("/orders/update/{id}")
def update_order_status(id: int, status: str = Form(...)):
    try:
        with engine.connect() as conn:
            conn.execute(text("UPDATE orders SET status = :status WHERE id = :id"), {"status": status, "id": id})
            conn.commit()
    except Exception as e:
        pass
    return RedirectResponse(url="/orders", status_code=303)

@router.post("/orders/delete/{id}")
def delete_order(id: int):
    try:
        with engine.connect() as conn:
            conn.execute(text("DELETE FROM orders WHERE id = :id"), {"id": id})
            conn.commit()
    except Exception as e:
        pass
    return RedirectResponse(url="/orders", status_code=303)

@router.post("/api/order")
async def api_add_order(data: OrderCreate):
    try:
        with engine.connect() as conn:
            result = conn.execute(text("SELECT * FROM menu WHERE ID = :id"), {"id": data.menu_id})
            item = result.fetchone()
            if item is None:
                return {"ok": False, "error": "Mon khong ton tai"}
            conn.execute(
                text("INSERT INTO orders (menu_id, menu_name, menu_price, menu_size, customer_name, phone, address, quantity) VALUES (:menu_id, :menu_name, :menu_price, :menu_size, :customer_name, :phone, :address, :quantity)"),
                {"menu_id": item.ID, "menu_name": item.Name, "menu_price": item.Price, "menu_size": item.Size, "customer_name": data.customer_name, "phone": data.phone, "address": data.address, "quantity": data.quantity}
            )
            conn.commit()
        return {"ok": True}
    except Exception as e:
        return {"ok": False, "error": str(e)}
