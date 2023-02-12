import React, { ReactNode } from 'react';
import {
  IconButton,
  Box,
  CloseButton,
  Flex,
  Icon,
  useColorModeValue,
  Link,
  Drawer,
  DrawerContent,
  Text,
  useDisclosure,
  BoxProps,
  FlexProps,
  useBoolean,
  Tooltip,
  Avatar,
} from '@chakra-ui/react';
import {
  FiHome,
  FiTrendingUp,
  FiCompass,
  FiStar,
  FiSettings,
  FiMenu,
} from 'react-icons/fi';
import { IconType } from 'react-icons';
import { cities } from '../../constant';

interface LinkItemProps {
  name: string;
  icon: IconType;
}
const LinkItems: Array<LinkItemProps> = [
  { name: 'Home', icon: FiHome },
  { name: 'Trending', icon: FiTrendingUp },
  { name: 'Explore', icon: FiCompass },
  { name: 'Favourites', icon: FiStar },
  { name: 'Settings', icon: FiSettings },
];

function SidebarWithHeader({
  children,
}: {
  children: ReactNode;
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [expand, { toggle }] = useBoolean(false);

  return (
    <Box minH="100vh" bg={useColorModeValue('gray.100', 'gray.900')}>
      <SidebarContent
        onClose={() => onClose}
        display={{ base: 'none', md: 'block' }}
        expand={expand}
        setExpand={toggle}
      />
      <Drawer
        autoFocus={false}
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full">
        <DrawerContent>
          <SidebarContent
            onClose={onClose}
            expand={expand}
            setExpand={toggle}
          />
        </DrawerContent>
      </Drawer>
      {/* mobilenav */}
      <MobileNav display={{ base: 'flex', md: 'none' }} onOpen={onOpen} />
      <Box ml={{ base: 0, md: 60 }} p="4">
        {children}
      </Box>
    </Box>
  );
}

interface SidebarProps extends BoxProps {
  onClose: () => void;
  expand: boolean;
  setExpand: () => void;
}

const SidebarContent = ({
  onClose,
  expand,
  setExpand,
  ...rest
}: SidebarProps) => {
  return (
    <Box
      bg={useColorModeValue('white', 'gray.900')}
      borderRight="1px"
      borderRightColor={useColorModeValue('gray.200', 'gray.700')}
      w={{ base: 'full', md: expand ? 60 : 20 }}
      pos="fixed"
      h="full"
      overflowY={'scroll'}
      overflowX={'hidden'}
      __css={{
        '&::-webkit-scrollbar': {
          w: '2',
        },
        '&::-webkit-scrollbar-track': {
          w: '6',
        },
        '&::-webkit-scrollbar-thumb': {
          borderRadius: '10',
          bg: `teal.100`,
        },
      }}
      {...rest}>
      <Flex
        h="20"
        alignItems="center"
        px="1"
        mx="4"
        justifyContent={{ base: 'space-between', md: 'normal' }}>
        <IconButton
          variant="outline"
          onClick={setExpand}
          mr="4"
          aria-label="expand menu"
          display={{ base: 'none', md: 'flex' }}
          icon={<FiMenu />}
        />

        <Text
          display={{ md: expand ? 'block' : 'none' }}
          fontSize="2xl"
          fontFamily="monospace"
          fontWeight="bold">
          Logo
        </Text>
        <CloseButton display={{ base: 'flex', md: 'none' }} onClick={onClose} />
      </Flex>
      {cities?.map((city) => (
        <NavItem
          key={city.name}
          initial={city.code}
          navText={city.name}
          tooltipText={city.name}
          expand={expand}
        />
      ))}
    </Box>
  );
};

interface NavItemProps extends FlexProps {
  initial: string;
  navText: string;
  tooltipText: string;
  expand: boolean;
}
const NavItem = ({
  initial,
  navText,
  tooltipText,
  expand,
  ...rest
}: NavItemProps) => {
  return (
    <Tooltip
      display={{ md: !expand ? 'block' : 'none' }}
      label={tooltipText}
      placement={'right'}
      bgColor={'white'}
      color={'black'}>
      <Link
        href="#"
        style={{ textDecoration: 'none' }}
        _focus={{ boxShadow: '0px 1px 25px -5px rgb(66 153 225 / 48%), 0 10px 10px -5px rgb(66 153 225 / 43%)', }}>
        <Flex
          align="center"
          paddingY="4"
          paddingX="6"
          mx="4"
          borderRadius="lg"
          role="group"
          cursor="pointer"
          _hover={{
            boxShadow: '0px 1px 25px -5px rgb(66 153 225 / 48%), 0 10px 10px -5px rgb(66 153 225 / 43%)',
            scale: 1.2,
          }}
          {...rest}>
            <Avatar
              size={'sm'}
              name={tooltipText}
              position={'relative'}
              left={-5}
            />
          <Text display={{ md: expand ? 'block' : 'none' }}>{navText}</Text>
        </Flex>
      </Link>
    </Tooltip>
  );
};

interface MobileProps extends FlexProps {
  onOpen: () => void;
}
const MobileNav = ({ onOpen, ...rest }: MobileProps) => {
  return (
    <Flex
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 24 }}
      height="20"
      alignItems="center"
      bg={useColorModeValue('white', 'gray.900')}
      borderBottomWidth="1px"
      borderBottomColor={useColorModeValue('gray.200', 'gray.700')}
      justifyContent="flex-start"
      {...rest}>
      <IconButton
        variant="outline"
        onClick={onOpen}
        aria-label="open menu"
        icon={<FiMenu />}
      />

      <Text fontSize="2xl" ml="8" fontFamily="monospace" fontWeight="bold">
        Logo
      </Text>
    </Flex>
  );
};

export { SidebarWithHeader }