import Alert from 'react-bootstrap/Alert';

const SuccessAlert = ({ message }) => {
    if (message) {
        return (
            <Alert variant='success'>{message}</Alert>
        );
    }
};

export default SuccessAlert;