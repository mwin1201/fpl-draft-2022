import Alert from 'react-bootstrap/Alert';

const DangerAlert = ({ message }) => {
    if (message) {
        return (
            <Alert variant='danger'>{message}</Alert>
        );
    }
};

export default DangerAlert;