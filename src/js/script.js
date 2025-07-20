document.addEventListener('DOMContentLoaded', function() {
  // Detekce rozlišení obrazovky a typu zařízení
  function checkDeviceCompatibility() {
    // Pokud je zapnutý dev mode, obejdi kontrolu zařízení
    if (window.settings && window.settings.devmode === true) {
      console.log('🔧 Dev mode aktivní - obcházím kontrolu mobilního zařízení');
      return true;
    }
    
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const userAgent = navigator.userAgent.toLowerCase();
    
    // Detekce mobilního zařízení podle user agent
    const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
    
    // Detekce podle rozlišení (mobilní zařízení obvykle mají šířku do 768px)
    const isMobileResolution = screenWidth <= 768;
    
    // Pokud není mobilní zařízení nebo má velké rozlišení
    if (!isMobile || !isMobileResolution) {
      // Vytvoření overlay s upozorněním
      const overlay = document.createElement('div');
      overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.95);
        color: #fff;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        z-index: 9999;
        font-family: sans-serif;
        text-align: center;
        padding: 20px;
        box-sizing: border-box;
      `;
      
      overlay.innerHTML = `
        <div style="max-width: 400px;">
          <h2 style="color: #ff6b6b; margin-bottom: 20px;">📱 Pouze pro mobilní zařízení</h2>
          <p style="font-size: 18px; line-height: 1.5; margin-bottom: 20px;">
            Tato aplikace je optimalizována pouze pro mobilní telefony.
          </p>
          <p style="font-size: 16px; color: #ccc; margin-bottom: 30px;">
            Prosím, otevřete ji na svém mobilním zařízení pro nejlepší zážitek.
          </p>
          <div style="font-size: 14px; color: #888;">
            Vaše rozlišení: ${screenWidth} × ${screenHeight}px
          </div>
        </div>
      `;
      
      document.body.appendChild(overlay);
      return false;
    }
    return true;
  }
  
  // Kontrola kompatibility při načtení
  const isCompatible = checkDeviceCompatibility();
  
  // Kontrola při změně orientace nebo velikosti okna
  window.addEventListener('resize', checkDeviceCompatibility);
  window.addEventListener('orientationchange', function() {
    setTimeout(checkDeviceCompatibility, 100);
  });
  
  // Pokud je zařízení kompatibilní, inicializuj aplikaci
  if (isCompatible) {
    const keepButton = document.querySelector('.btn-keep');
    const undoButton = document.querySelector('.btn-undo');
    const input = document.querySelector('input[type="text"]');
    const sendButton = document.querySelector('.input-wrapper button');

    if (keepButton) {
      keepButton.addEventListener('click', function() {
        alert('Změny uloženy!');
      });
    }

    if (undoButton) {
      undoButton.addEventListener('click', function() {
        alert('Změny vráceny!');
      });
    }

    if (sendButton) {
      sendButton.addEventListener('click', function() {
        const message = input.value.trim();
        if (message) {
          alert('Zpráva odeslána: ' + message);
          input.value = '';
        }
      });
    }
    
    // Odeslání zprávy při stisknutí Enter
    if (input) {
      input.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
          sendButton.click();
        }
      });
    }
  }
  
  // Dropdown functionality
  const handleDropdownToggle = (event) => {
    event.stopPropagation();
    const dropdown = event.currentTarget.closest('.dropdown');
    const isOpen = dropdown.classList.contains('open');
    
    console.log('🖱️ Toggle clicked, dropdown:', dropdown, 'isOpen:', isOpen);
    
    // Close all dropdowns first
    const openDropdowns = document.querySelectorAll('.dropdown.open');
    console.log('🔒 Closing', openDropdowns.length, 'open dropdowns');
    openDropdowns.forEach(d => d.classList.remove('open'));
    
    // Toggle current dropdown
    if (!isOpen) {
      dropdown.classList.add('open');
      console.log('✅ Opened dropdown');
    } else {
      console.log('🔒 Dropdown was already open, now closed');
    }
  };

  const handleDropdownItemClick = (event) => {
    event.stopPropagation();
    const item = event.target;
    const dropdown = item.closest('.dropdown');
    const trigger = dropdown.querySelector('.dropdown-label');
    
    console.log('Item clicked:', item.textContent);
    
    // Update label
    trigger.textContent = item.textContent;
    
    // Close dropdown
    dropdown.classList.remove('open');
    
    console.log('Selected:', item.dataset.value, item.textContent);
  };

  const handleClickOutside = (event) => {
    if (!event.target.closest('.dropdown')) {
      document.querySelectorAll('.dropdown.open').forEach(d => d.classList.remove('open'));
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleDropdownToggle(event);
    } else if (event.key === 'Escape') {
      document.querySelectorAll('.dropdown.open').forEach(d => d.classList.remove('open'));
    }
  };

  // Initialize dropdowns
  const initializeDropdowns = () => {
    console.log('🔧 Initializing dropdowns...');
    
    // Add event listeners to dropdown triggers
    const triggers = document.querySelectorAll('.dropdown-trigger');
    console.log('📋 Found triggers:', triggers.length);
    
    triggers.forEach((trigger, index) => {
      trigger.addEventListener('click', handleDropdownToggle);
      console.log(`✅ Added click listener to trigger ${index + 1}`);
    });

    // Add event listeners to dropdown items
    const items = document.querySelectorAll('.dropdown-item');
    console.log('📋 Found items:', items.length);
    
    items.forEach((item, index) => {
      item.addEventListener('click', handleDropdownItemClick);
      console.log(`✅ Added click listener to item ${index + 1}: ${item.textContent}`);
    });

    // Add keyboard support
    const dropdowns = document.querySelectorAll('.dropdown');
    console.log('📋 Found dropdowns:', dropdowns.length);
    
    dropdowns.forEach((dropdown, index) => {
      dropdown.addEventListener('keydown', handleKeyDown);
      console.log(`✅ Added keyboard support to dropdown ${index + 1}`);
    });

    // Close dropdowns when clicking outside
    document.addEventListener('click', handleClickOutside);
    
    console.log('🎉 Dropdowns initialized successfully');
  };

  // Initialize dropdowns always (not dependent on device compatibility)
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeDropdowns);
  } else {
    initializeDropdowns();
  }

  // Initialize file card toggle functionality
  const initializeFileCardToggle = () => {
    console.log('🔧 Initializing file card toggle...');
    
    const fileCardTitle = document.querySelector('.file-card-header-title');
    const fileCard = document.querySelector('.file-changes-card');
    
    if (fileCardTitle && fileCard) {
      console.log('✅ Found file card elements');
      
      const handleToggle = (event) => {
        event.preventDefault();
        event.stopPropagation();
        
        const isCollapsed = fileCard.classList.contains('collapsed');
        console.log('🖱️ Toggle clicked, isCollapsed:', isCollapsed);
        
        if (isCollapsed) {
          fileCard.classList.remove('collapsed');
          console.log('📂 Expanded file card');
        } else {
          fileCard.classList.add('collapsed');
          console.log('📁 Collapsed file card');
        }
      };

      // Click event
      fileCardTitle.addEventListener('click', handleToggle);
      
      // Keyboard support
      fileCardTitle.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          handleToggle(event);
        }
      });
      
      console.log('✅ File card toggle initialized');
    } else {
      console.log('❌ File card elements not found');
    }
  };

  // Initialize file card toggle
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeFileCardToggle);
  } else {
    initializeFileCardToggle();
  }
});