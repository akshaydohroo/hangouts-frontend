import { MenuItem, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function LoginMenuItem(){
    const navigate = useNavigate();
    return (
        <MenuItem onClick={()=>navigate("/login")}>
           <Typography>
                Login
           </Typography>
        </MenuItem>
    )
}