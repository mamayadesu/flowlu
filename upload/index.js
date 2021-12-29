function loadHistory()
{
    var xhr = new XMLHttpRequest();
    
    xhr.open("POST", "history.php", true);
    var el = document.getElementById("history");
    xhr.onreadystatechange = function()
    {
        console.log(xhr.readyState);
        if (xhr.readyState != 4)
        {
            return;
        }
        var data = JSON.parse(xhr.responseText);
        
        if (data.length == 0)
        {
            el.innerHTML = "<i>История ваших проверок пуста</i>";
        }
        else
        {
            var output = "<table border><tr><th>Выражение</th><th>Успешно</th><th>Время</th></tr>";
            for (let k in data)
            {
                output += "<tr><td><code>" + data[k]["expression"] + "</code></td><td>" + (data[k]["is_success"] ? "<b style='color: green;'>Успешно</b>" : "<b style='color: red;'>Ошибка</b>") + "</td><td>" + data[k]["date"] + "</td></tr>";
            }
            el.innerHTML = output;
        }
    };
    xhr.onerror = function()
    {
        el.innerHTML = "Ошибка при загрузке истории проверок. <a href='#' onclick='loadHistory();'>Попробовать снова</a>";
    };
    
    xhr.send([]);
}

function check()
{
    var query = document.getElementById("expression"), checkBtn = document.getElementById("check");
    if (query.value == "")
    {
        alert("Укажите выражение");
        return;
    }
    var xhr = new XMLHttpRequest();
    query.disabled = checkBtn.disabled = true;
    xhr.open("POST", "check.php", true);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    var successBlock = document.getElementById("success"), errorBlock = document.getElementById("error");
    xhr.onreadystatechange = function()
    {
        if (xhr.readyState != 4)
        {
            return;
        }
        var data = JSON.parse(xhr.responseText);
        query.disabled = checkBtn.disabled = false;
        if (data["success"])
        {
            loadHistory();
            query.placeholder = query.value;
            query.value = "";
            
            errorBlock.style.display = "none";
            successBlock.style.display = "";
        }
        else
        {
            if (typeof data["error"] == "undefined")
            {
                errorBlock.innerHTML = "Ваш запрос содержит ошибки. Одна или более скобок не закрыта либо присутсвует лишняя закрывающая скобка"
                loadHistory();
            }
            else
            {
                errorBlock.innerHTML = "Произошла ошибка при проверке запроса. " + data["error"];
            }
            errorBlock.style.display = "";
            successBlock.style.display = "none";
        }
    };
    xhr.onerror = function()
    {
        query.disabled = checkBtn.disabled = false;
        errorBlock.innerHTML = "Не удалось проверить выражение. Ошибка подключения к серверу";
        errorBlock.style.display = "";
    };
    
    xhr.send("query=" + encodeURI(query.value));
}

window.onload = function()
{
    console.log("страница загружена");
    document.getElementById("error").style.display = "none";
    document.getElementById("success").style.display = "none";
    loadHistory();
};