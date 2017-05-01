document.addEventListener('DOMContentLoaded', () => {

  function supportsLocalStorage() {
    try {
      return 'localStorage' in window && window['localStorage'] !== null;
    } catch(e){
      return false;
    }
  }

  if (supportsLocalStorage()) {
    function getNameList(){
      let namesList = localStorage.getItem('invitedList');
      if (namesList) {
          console.log(namesList);
          return JSON.parse(namesList);
        }
      console.log('clean massive');
      return [];
    }

    // Validate and save names in localStorage
    function saveNameList(str) {
      let namesList = getNameList();
      if (namesList.indexOf(str) > -1 || !str) {
        return false;
      }
      namesList.push(str);
      localStorage.setItem('invitedList', JSON.stringify(namesList));
      return true;
    }

    const form = document.getElementById('registrar');
    const input = form.querySelector('input');
    const mainDiv = document.querySelector('.main');
    const ul = document.getElementById('invitedList');
    const div = document.createElement('div');
    const filterLabel = document.createElement('label');
    const filterCheckBox = document.createElement('input');
    const header = document.querySelector('header');
    const alertMessage = document.createElement('h5');
    const alertMessageDuble = document.createElement('h5');
    const lis = ul.children;

    // Respond area
    filterLabel.textContent = "Hide those who haven't responded";
    filterCheckBox.type = 'checkbox';
    div.appendChild(filterLabel);
    div.appendChild(filterCheckBox);
    mainDiv.insertBefore(div, ul);

    // Error messages
    alertMessage.textContent = `Type name, please.`;
    alertMessage.style.display = 'none';
    header.appendChild(alertMessage);
    alertMessageDuble.textContent = `You're already in the list.`;
    alertMessageDuble.style.color = 'green';
    alertMessageDuble.style.display = 'none';
    header.appendChild(alertMessageDuble);

    // Respond checker
    filterCheckBox.addEventListener('change', (e) => {
      const isChecked = e.target.checked;
      if(isChecked) {
        for (let i = 0; i < lis.length; i += 1) {
          let li = lis[i];
          if (li.className === 'responded') {
            li.style.display = '';  
            li.querySelector('label').style.display = 'none';                    
          } else {
            li.style.display = 'none';    
          }
        }
      } else {
        for (let i = 0; i < lis.length; i += 1) {
          let li = lis[i];
          li.style.display = '';
          li.querySelector('label').style.display = '';
        }                                 
      }
    });
    
    function createLI(text) {
      function createElement( elementName, property, value ) {
        const element = document.createElement(elementName);  
        element[property] = value;
        return element;
      }

      function appendToLi(elementName, property, value) {
        const element = createElement(elementName, property, value);     
        li.appendChild(element);
        return element;
      }

      const li = document.createElement('li');
      appendToLi('span', 'textContent', text);  
      appendToLi('label', 'textContent', 'Confirm')
      .appendChild(createElement('input', 'type', 'checkbox'));
      appendToLi('button', 'textContent', 'edit');
      appendToLi('button', 'textContent', 'remove');
      return li;
    }

    // Initialize display list
    var invitedList = getNameList();
    invitedList.forEach( function (text) {
      let li = createLI(text);
      ul.appendChild(li);
    });
    
    // show errors functions
    function showErrorEmpty ( value ) {
      alertMessage.style.display = value;
    }
    function showErrorDuble ( value ) {
      alertMessageDuble.style.display = value;
    }

    form.addEventListener('submit', (e) => {
      e.preventDefault();
        const text = input.value;
      if (text !== '') {
        let maches = 0;
        for (var i = lis.length - 1; i >= 0; i--) {
          const name = lis[i].querySelector('span').textContent;
          if (name === text) maches++;
        }
        if ( maches === 0) {
          input.value = '';
          const li = createLI(text);
          saveNameList(text);
          ul.appendChild(li);
          // clear screen from errors
          showErrorEmpty('none');
          showErrorDuble('none');
        } else {
          showErrorDuble('');
        }
      } else {
        showErrorEmpty('');
      }
    });
    
    // style of responded Name
    ul.addEventListener('change', (e) => {
      const checkbox = event.target;
      const checked = checkbox.checked;
      const listItem = checkbox.parentNode.parentNode;
      const labelItem = checkbox.parentNode;
      if (checked) {
        listItem.className = 'responded';
        labelItem.firstChild.textContent = 'Confirmed';
      } else {
        listItem.className = '';
        labelItem.firstChild.textContent = 'Confirm';
      }
    });
      
    ul.addEventListener('click', (e) => {
      if (e.target.tagName === 'BUTTON') {
        const button = e.target;
        const li = button.parentNode;
        const ul = li.parentNode;
        const action = button.textContent;

        const nameActions = {
          remove: () => {
            ul.removeChild(li);
          },
          save: () => {
            const input = li.firstElementChild;
            const span = document.createElement('span');
            span.textContent = input.value;
            li.insertBefore(span, input);
            li.removeChild(input);
            button.textContent = 'edit';
          },
          edit: () => {
            const span = li.firstElementChild;
            const input = document.createElement('input');
            input.type = 'text';
            input.value = span.textContent;
            li.insertBefore(input, span);
            li.removeChild(span);
            button.textContent = 'save';
          }
        };
        nameActions[action]();
      }
    });
  };  
});  
  
  
  
  
  
  
  
  
  