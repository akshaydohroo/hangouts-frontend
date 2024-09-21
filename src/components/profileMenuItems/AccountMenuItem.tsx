import { ListItemIcon, MenuItem, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function AccountMenuItem(){
    const navigate = useNavigate();

    return (
        <MenuItem onClick={()=>{navigate("/account")}}>
           <Typography>
                Account
           </Typography>
        </MenuItem>
    )
}