import React, { useState } from 'react';
import '../css/eyePassword.css'


function EyePassword({value,onChange}) {

  const [showPassword, setShowPassword] = useState(false);
  const [src,setSrc]=useState(require("../images/hide.png"))
  

  const toggle = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
    
    if(src===require("../images/hide.png")) setSrc(require("../images/unhide.png"))
    else setSrc(require("../images/hide.png"))
  };

  return (
    <div>
    <div className="password-input-container">
        <input
        type={showPassword ? 'text' : 'password'}
        className="eye-input-pswrd"
        value={value}
        onChange={onChange}
        autoComplete="current-password"
        required
        />
      <div className="eye-icon" onClick={toggle}>
            <img src={src} alt="Toggle Password Visibility" />
          </div>
    </div>
    </div>
  )
}

export default EyePassword
