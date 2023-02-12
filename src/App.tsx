import * as React from "react"
import {
  ChakraProvider,
  Box,
  Text,
  Link,
  VStack,
  Code,
  Grid,
  theme,
} from "@chakra-ui/react"
import { Logo } from "./Logo"
import { MapContainer } from "./Component"
import { SidebarWithHeader } from "./Component/layout"
import { ColorModeSwitcher } from "./Component/layout/ColorModeSwitcher"

export const App = () => (
  <ChakraProvider theme={theme}>
    <Box textAlign="center" fontSize="xl">
      <SidebarWithHeader>
        <Grid minH="100vh" p={3}>
          <ColorModeSwitcher justifySelf="flex-end" />
          <VStack spacing={8}>
            <MapContainer />
          </VStack>
        </Grid>
      </SidebarWithHeader>
    </Box>
  </ChakraProvider>
)
