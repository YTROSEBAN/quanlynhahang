// === Add menu form ===
async function uploadImage() {
    let fileInput = document.getElementById("productImage");
    if (!fileInput || !fileInput.files || !fileInput.files[0]) return "";
    let formData = new FormData();
    formData.append("image", fileInput.files[0]);
    let res = await fetch("/api/upload", { method: "POST", body: formData });
    let data = await res.json();
    return data.url || "";
}

async function saveMenu() {
    try {
        let name = document.getElementById("productName").value.trim();
        let price = document.getElementById("productPrice").value.trim();
        let size = document.getElementById("productSize").value.trim();
        let type = document.getElementById("productType").value.trim();

        if (!name || !price || !size || !type) {
            alert("Vui long dien day du thong tin!");
            return;
        }

        let imageUrl = await uploadImage();

        let res = await fetch("/api/menu", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                ID: 0,
                Name: name,
                price: parseInt(price),
                Size: parseInt(size),
                Image: imageUrl,
                type: type
            })
        });

        let result = await res.json();

        if (result.ok) {
            alert("Them mon thanh cong!");
            document.getElementById("menuForm").reset();
            window.location.href = "/menu/add";
        } else {
            alert("Loi: " + (result.error || "Khong the them menu"));
        }
    } catch (err) {
        console.error(err);
        alert("Loi: " + err.message);
    }
}

// === Load menu cards on homepage ===
document.addEventListener("DOMContentLoaded", function () {
    let container = document.getElementById("menuContainer");
    if (!container) return;

    fetch("/api/menu")
        .then((res) => res.json())
        .then((data) => {
            if (data.error || data.length === 0) {
                container.innerHTML = '<p class="text-center">Chưa có món nào</p>';
                return;
            }
            data.forEach((item) => {
                let col = document.createElement("div");
                col.className = "col mb-5";
                let imgSrc = item.Image || "https://dummyimage.com/450x300/dee2e6/6c757d.jpg";
                col.innerHTML = `
                    <div class="card h-100">
                        <img class="card-img-top" src="${imgSrc}" alt="${item.Name}" />
                        <div class="card-body p-4">
                            <div class="text-center">
                                <h5 class="fw-bolder">${item.Name}</h5>
                                ${item.Price} VND<br>
                                <small class="text-muted">Size: ${item.Size}</small><br>
                                <span class="badge bg-secondary">${item.Type}</span>
                            </div>
                        </div>
                        <div class="card-footer p-4 pt-0 border-top-0 bg-transparent">
                            <div class="text-center">
                                <a class="btn btn-success btn-sm" href="/order/${item.ID}">Order</a>
                                <a class="btn btn-warning btn-sm" href="/menu/edit/${item.ID}">Sửa</a>
                                <a class="btn btn-danger btn-sm" href="/menu/delete/${item.ID}" onclick="return confirm('Bạn có chắc muốn xóa?')">Xóa</a>
                            </div>
                        </div>
                    </div>`;
                container.appendChild(col);
            });
        })
        .catch((err) => {
            console.error(err);
            container.innerHTML = '<p class="text-center text-danger">Lỗi tải dữ liệu</p>';
        });
});