domReady(function(){
    const form = document.querySelector('form');
    const deconnectionBtn = document.querySelector('.signoutContainer > button');
    const memberOnlyBtn = document.querySelector('.memberOnly');
    const loginContainer = document.querySelector('.loginContainer');
    const signoutContainer = document.querySelector('.signoutContainer');
    const emailUserContainer = document.querySelector('.signoutContainer > .emailUser'); 
    switchShowHideSign();
    function logIn(){
        event.preventDefault();
        if(fetch){
            fetch("/connect",{
                method: 'POST',
                body: new FormData(form)
            }).then(callbackLogin)
            .catch((err)=>{
                console.error(err, "test");
            });
        }
    };
    function logOut(){
        logOutAction();
    }
    function callbackLogin(response){
        console.log(response);
        if(response.status >= 200 && response.status < 300){
            response.json().then(function(token){
                form.reset();
                logInAction(token);
            });
        }
    }
    document.addEventListener("logIn",function(){
        switchShowHideSign();
    });
    document.addEventListener("logOut",function(){
        switchShowHideSign();
    });
    function showSignOut(){
        const token =  localStorage.getItem(keyToken);
        emailUserContainer.innerHTML = token;
        signoutContainer.style.display = "block";
        loginContainer.style.display = "none";

    }
    function showSignIn(){
        signoutContainer.style.display = "none";
        loginContainer.style.display = "block";
    }
    function switchShowHideSign(){
        if(localStorage.getItem(keyToken)){
            showSignOut();
        }else{
            showSignIn();
        }
    }
    form.addEventListener('submit', logIn);

    function makeRequestWithToken(evt){
        evt.preventDefault();
        var pageName = this.name;
        var tokenFromStorage = localStorage.getItem(keyToken);
        var config = {};
        if(tokenFromStorage){
            config.headers = {
                Authorization: `Bearer `+tokenFromStorage
            };
        }
        axios.get("http://localhost:3000/" + pageName, config).then(
            res=>{
                console.log('success');
                console.log(res);
            }
        ).catch(err =>{
            console.error(err);
        })
    }
    memberOnlyBtn.addEventListener('click', makeRequestWithToken);
    deconnectionBtn.addEventListener('click', logOut);
});