import React from "react";
import { withStyles } from "@material-ui/core/styles";
import Menu, { MenuProps } from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import MenuIcon from "@material-ui/icons/Menu";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import { IconButton, Tooltip } from "@material-ui/core";
import { Link } from "react-router-dom";
import StorageIcon from "@material-ui/icons/Storage";
import { useCookies } from "react-cookie";

const StyledMenu = withStyles({
    paper: {
        border: "1px solid #d3d4d5",
    },
})((props: MenuProps) => (
    <Menu
        elevation={0}
        getContentAnchorEl={null}
        anchorOrigin={{
            vertical: "bottom",
            horizontal: "center",
        }}
        transformOrigin={{
            vertical: "top",
            horizontal: "center",
        }}
        {...props}
    />
));

interface IUserMenu {
    setAuth(bool: boolean): void;
}

export default function CustomizedMenus({ setAuth }: IUserMenu) {
    const [_cookies, _setCookie, removeCookie] = useCookies([""]);

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const logout = (e: React.MouseEvent<HTMLElement>) => {
        e.preventDefault();
        removeCookie("token");
        localStorage.removeItem("token");
        setAuth(false);
    };

    return (
        <div>
            <Tooltip title="Menu">
                <IconButton
                    aria-label="menu"
                    aria-controls="customized-menu"
                    aria-haspopup="true"
                    onClick={handleClick}
                >
                    <MenuIcon />
                </IconButton>
            </Tooltip>
            <StyledMenu
                id="customized-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                <MenuItem component={Link} to="/">
                    <ListItemIcon>
                        <StorageIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Server" />
                </MenuItem>
                <MenuItem onClick={(e) => logout(e)}>
                    <ListItemIcon>
                        <ExitToAppIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Logout" />
                </MenuItem>
            </StyledMenu>
        </div>
    );
}
