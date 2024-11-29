import { Box, Stack } from "@chakra-ui/react";
import { Navbar } from "../../components/root/Navbar.jsx";
import { Outlet } from "react-router-dom";

export function RootLayout() {
  return (
    <Stack>
      <Box>
        <Navbar />
      </Box>
      <Box>
        <Outlet />
      </Box>
    </Stack>
  );
}
