import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import qrcode from "../../public/qrcode.jpg";

export default function QrcodeDialog() {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Button variant="outlined" size="small" onClick={handleClickOpen}>
        问卷
      </Button>
      <Dialog open={open} keepMounted onClose={handleClose}>
        <img width={300} src={qrcode} />
      </Dialog>
    </div>
  );
}
