import React from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import logo from '../style/image/kht.png';

const Header = () => {
    return (
        <header className="p-3 d-flex align-items-center justify-content-between fixed-top border-bottom" style={{ backgroundColor: 'white'}}>
            <div className="d-flex align-items-center">
                <a href="/user/dashboard">
                    <img 
                        src={logo}
                        alt="TST" 
                        style={{ width: '150px', height: '75px', marginLeft: '10px' }} 
                    />
                </a>
            </div>
        </header>
    );
};
export default Header;