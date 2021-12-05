// username 입력 체크
function name_check() {
    var name = document.getElementById('name').value;

    if (name == "") {
      document.getElementById('n_c').innerHTML = "* 이름을 입력해주세요.";
      // document.getElementById('n_c').style.color = 'red';
    } else {
      document.getElementById('n_c').innerHTML = "";
    }
  }

  // username 입력 체크 2
function name_check_() {
  var name = document.getElementById('name_').value;

  if (name == "") {
    document.getElementById('n_c_').innerHTML = "* 이름을 입력해주세요.";
    // document.getElementById('n_c').style.color = 'red';
  } else {
    document.getElementById('n_c_').innerHTML = "";
  }
}

  // 비밀번호 재입력 체크
  function pw_rechek() {
    var pwd1 = document.getElementById('pwd1').value;
    var pwd2 = document.getElementById('pwd2').value;

    if (pwd2 == "") {
      document.getElementById('p2_c').innerHTML = "* 비밀번호를 다시 입력해주세요.";
      document.getElementById('p2_c').style.color = 'red';
    } else {

      if (pwd1 == pwd2) {
        document.getElementById('p2_c').innerHTML = "* 비밀번호가 일치합니다.";
        document.getElementById('p2_c').style.color = 'blue';
      } else {
        document.getElementById('p2_c').innerHTML = "* 비밀번호가 일치하지 않습니다.";
        document.getElementById('p2_c').style.color = 'red';
      }

    }
  }

  // 이메일 입력 체크
  function email_check() {
    var email = document.getElementById('email').value;
    var email_ok = document.getElementById('email_ok');

    email_ok.disabled = false;

    var check = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;

    if (email.match(check) != null) {
      document.getElementById('e_c').innerHTML = "";
      document.getElementById('e_c').style.color = 'blue';

    } else {
      document.getElementById('e_c').innerHTML = "* 이메일 형식이 바르지 않습니다.";
      document.getElementById('e_c').style.color = 'red';
    }

  }

  // 이메일 입력 체크 2
  function email_check_() {
    var email = document.getElementById('email').value;

    var check = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;

    if (email.match(check) != null) {
      document.getElementById('e_c').innerHTML = "";
      document.getElementById('e_c').style.color = 'blue';

    } else {
      document.getElementById('e_c').innerHTML = "* 이메일 형식이 바르지 않습니다.";
      document.getElementById('e_c').style.color = 'red';
    }

  }

  // 비밀번호 입력 체크
  function pwd_check() {
    var pwd = document.getElementById('pwd1').value;

    var check = /^(?=.*[a-zA-z])(?=.*[0-9])(?=.*[$`~!@$!%*#^?&\\(\\)\-_=+]).{8,16}$/i;

    if (pwd.length > 7) {
      if (pwd.match(check) != null) {
        document.getElementById('p1_c').innerHTML = "";
      } else {
        document.getElementById('p1_c').innerHTML = "* 하나 이상의 숫자, 영문, 특수문자를 입력해주세요.";
        // document.getElementById('p1_c').style.color = 'red';
      }
    } else {
      document.getElementById('p1_c').innerHTML = "* 8자리 이상 입력해주세요.";
      // document.getElementById('p1_c').style.color = 'red';
    }

  }

  // 연락처 체크
  function tel_check(){
    var tel = document.getElementById('tel').value;

    var check = /^01([0|1|6|7|8|9])?([0-9]{3,4})?([0-9]{4})$/;

    if(tel == ""){
      document.getElementById('t_c').innerHTML = "* 연락처를 입력해주세요.";
    } else {
      if(tel.match(check) != null) {
        document.getElementById('t_c').innerHTML = "";
      } else {
        document.getElementById('t_c').innerHTML = "* 전화번호 형식이 바르지 않습니다.";
        
      }
    }
  }

