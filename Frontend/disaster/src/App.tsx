import { useState, useEffect } from 'react';
import { RouterProvider } from "react-router";
import Router from "./routes/router";
import DisasterAlert from './components/DisasterAlert';
import useDisasterWebSocket from './hooks/useDisasterWebSocket';

export default function App() {
  const { disasterMessage, clearDisaster } = useDisasterWebSocket();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (disasterMessage) {
      setVisible(true);
    }
  }, [disasterMessage]);

  const handleClose = () => {
    setVisible(false);
    clearDisaster();
  };

  return (
    <>
      <RouterProvider router={Router} />
      {disasterMessage && (
        <DisasterAlert
          disasterType={disasterMessage.disasterType}
          location={disasterMessage.location}
          message={disasterMessage.message}
          visible={visible}
          onClose={handleClose}
        />
      )}
    </>
  );
}
