import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSackDollar } from '@fortawesome/free-solid-svg-icons';
import Spinner from 'react-bootstrap/Spinner';
const axios = require('axios').default;

const WalletValue = ({ owner_id }) => {
    const [walletValue, setWalletValue] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    const getWalletValue = async (owner_id) => {
        let currentOrigin = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_prodOrigin : "http://localhost:5000";
        axios.get(`${currentOrigin}/api/wallets/owner/` + owner_id)
        .then((apiResponse) => {
                setWalletValue(apiResponse.data.total);
                setIsLoading(false);
        })
        .catch(err => console.error(err));
    };

    getWalletValue(owner_id);

    if (isLoading) {
        return (
            <main>
                <span>Loading...<Spinner animation="border" variant="success" /></span>
            </main>
        );
    }

    return (
        <section>
            <div className="wallet-info">
                <FontAwesomeIcon icon={faSackDollar} size="2xl"  /> <h3><span>{walletValue}</span></h3>
            </div>
        </section>
    );

};

export default WalletValue;