import * as React from "react"
import {
  ChakraProvider,
  Box,
  VStack,
  Grid,
  theme,
} from "@chakra-ui/react"
import { MapContainer } from "./Component"
import { SidebarWithHeader } from "./Component/layout"
import { ColorModeSwitcher } from "./Component/layout/ColorModeSwitcher"

export const App = () => {
  const [selectedCity, setSelectedCity] = React.useState<{
    name: string,
    code: string,
    latitude: number,
    longitude: number,
} | any>({})

  return (
    <ChakraProvider theme={theme}>
      <Box textAlign="center" fontSize="xl">
        <SidebarWithHeader setSelectedCity={setSelectedCity}>
          <Grid minH="100vh" p={3}>
            <ColorModeSwitcher justifySelf="flex-end" />
            <VStack spacing={8}>
              <MapContainer selectedCity={selectedCity} />
            </VStack>
          </Grid>
        </SidebarWithHeader>
      </Box>
    </ChakraProvider>
  )
}
