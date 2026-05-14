document.addEventListener('DOMContentLoaded', function() {
    
    const processMath = (inputId, resultId, mode) => {
        const input = document.getElementById(inputId);
        const display = document.getElementById(resultId);
        const value = input.value.trim();

        if (value === "") {
            display.innerHTML = "Vui lòng nhập hàm số!";
            return;
        }

        try {
            let resultText = "";

            if (mode === 'derivative') {
                // Trong phần mode === 'derivative'
                const node = math.parse(value);
                const derivative = math.derivative(node, 'x');

                // Ép Math.js giữ nguyên các hàm logarit dưới dạng biểu thức
                const simplified = math.simplify(derivative, [
                    { l: 'log(n1, n2)', r: 'log(n1, n2)' }, 
                    { l: 'log(n)', r: 'log(n)' }
                ]).toString();

                // Chỉnh sửa hiển thị cho đẹp (Ví dụ: log(3, 2) -> log2(3))
                let finalDisplay = simplified.replace(/log\(([^,]+),\s*([^)]+)\)/g, 'log$2($1)');
                finalDisplay = finalDisplay.replace(/log/g, 'ln'); // Nếu muốn dùng ln cho log cơ số e

                resultText = `Kết quả: <b>${finalDisplay}</b>`;

            } else {
                let integralResult = Algebrite.integral(Algebrite.eval(value)).toString();
                integralResult = integralResult.replace(/ /g, ""); 
                resultText = `Kết quả: <b>${integralResult} + C</b>`;
            }

            display.innerHTML = resultText;
        } catch (error) {
            display.innerHTML = "<span style='color:red'>Lỗi: Kiểm tra lại cú pháp!</span>";
        }
    };

    // --- Giữ nguyên phần gán sự kiện Click và Enter phía dưới ---
    document.getElementById('btn_daoham').addEventListener('click', () => processMath('inp', 'results', 'derivative'));
    document.getElementById('btn_nguyenham').addEventListener('click', () => processMath('inp_2', 'results_2', 'integral'));

    const handleEnter = (inputId, btnId) => {
        document.getElementById(inputId).addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                document.getElementById(btnId).click();
            }
        });
    };
    handleEnter('inp', 'btn_daoham');
    handleEnter('inp_2', 'btn_nguyenham');
});