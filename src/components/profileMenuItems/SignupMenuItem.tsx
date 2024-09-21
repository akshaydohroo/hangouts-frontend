import { MenuItem, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function SignupMenuItem(){
    const navigate = useNavigate();
    return (
        <MenuItem onClick={()=>navigate("/signup")}>
           <Typography>
                Sign Up
           </Typography>
        </MenuItem>
    )
}