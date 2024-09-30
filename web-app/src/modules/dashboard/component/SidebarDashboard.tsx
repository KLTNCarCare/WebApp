import { ChevronLeft } from '@mui/icons-material';
import {
  Link,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Drawer as MuiDrawer,
  Tooltip,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import React, { ReactNode } from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import MapIcon from '@mui/icons-material/Map';
import ContactEmergencyIcon from '@mui/icons-material/ContactEmergency';
import DiscountIcon from '@mui/icons-material/Discount';
import CategoryIcon from '@mui/icons-material/Category';
import PriceChangeIcon from '@mui/icons-material/PriceChange';
import SelectLanguage from './SelectLanguage';

type SidebarDashboardProps = {
  isCollapse: boolean;
  setIsCollapse: (value: boolean) => void;
};
const sidebarDataDashboard: Array<{
  value: string;
  label: string;
  icon: ReactNode;
}> = [
  {
    value: '',
    label: 'selectLanguage',
    icon: <SelectLanguage />,
  },
  // {
  //   value: '/dashboard',
  //   label: 'viewFloodMap',
  //   icon: <MapIcon />,
  // },
  {
    value: '/account-management',
    label: 'accountManagement',
    icon: <ContactEmergencyIcon />,
  },
  {
    value: '/promotion',
    label: 'promotion',
    icon: <DiscountIcon />,
  },
  {
    value: '/category',
    label: 'category',
    icon: <CategoryIcon />,
  },
  {
    value: '/price-catalog',
    label: 'priceCatalog',
    icon: <PriceChangeIcon />,
  },
];

const SIDEBAR_WIDTH = 240;

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  width: SIDEBAR_WIDTH,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  ...(open && {
    width: SIDEBAR_WIDTH,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',

    '& .MuiDrawer-paper': {
      width: SIDEBAR_WIDTH,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      overflowX: 'hidden',
    },
  }),
  ...(!open && {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: `calc(${theme.spacing(8)} + 1px)`,
    '& .MuiDrawer-paper': {
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      overflowX: 'hidden',
      width: `calc(${theme.spacing(8)} + 1px)`,
    },
  }),
}));

const SidebarDashboard: React.FC<SidebarDashboardProps> = ({
  isCollapse,
  setIsCollapse,
}) => {
  const { t } = useTranslation();

  const handleSidebarToggle = () => {
    setIsCollapse(!isCollapse);
  };

  return (
    <>
      <Drawer
        open={!isCollapse}
        PaperProps={{ id: 'sidebar-content' }}
        variant="permanent"
        anchor="left"
        sx={(theme) => ({
          '+main': {
            width: isCollapse
              ? `calc(100% - ${SIDEBAR_WIDTH}px)`
              : `calc(100% - ${theme.spacing(8)} - 1px)`,
            '> header': {
              zIndex: theme.zIndex.drawer + 1,
              marginLeft: `calc(${theme.spacing(8)} + 1px)`,
              width: `calc(100% - ${theme.spacing(8)} - 1px)`,
              transition: theme.transitions.create(['width', 'margin'], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
              }),
              ...(isCollapse && {
                marginLeft: SIDEBAR_WIDTH,
                width: `calc(100% - ${SIDEBAR_WIDTH}px)`,
                transition: theme.transitions.create(['width', 'margin'], {
                  easing: theme.transitions.easing.sharp,
                  duration: theme.transitions.duration.enteringScreen,
                }),
              }),
            },
          },
        })}
      >
        <Link
          href={`/dashboard`}
          underline="none"
          sx={{
            px: !isCollapse ? 2.5 : `12px !important`,
            py: 3,
          }}
        ></Link>

        <List sx={{ flexGrow: 1 }}>
          {sidebarDataDashboard.map((item, idx) => (
            <ListItem key={idx} sx={{ px: 1, py: 0.5 }}>
              <Tooltip
                placement="right"
                title={!isCollapse ? null : t(`dashboard.${item.label}`)}
                arrow
              >
                <ListItemButton
                  component={NavLink}
                  to={item.value}
                  sx={(theme) => ({
                    minHeight: 48,
                    m: 0,
                    borderRadius: 2,
                    px: 1.5,
                    '&.active': {
                      color: `${item.value ? 'primary.main' : ''}`,
                      '&:hover': {
                        bgcolor: theme.palette.common.white,
                      },
                      svg: {
                        color: 'primary.main',
                      },
                    },
                  })}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText
                    primary={t(`dashboard.${item.label}`)}
                    primaryTypographyProps={{
                      fontWeight: '600 !important',
                    }}
                  />
                </ListItemButton>
              </Tooltip>
            </ListItem>
          ))}

          <ListItem
            sx={(theme) => ({
              bgcolor: theme.palette.common.white,
              boxShadow: theme.shadows[3],
              position: 'absolute',
              bottom: 0,
              left: 0,
            })}
          >
            <ListItemButton
              onClick={() => handleSidebarToggle()}
              sx={{ p: `12px 16px !important`, justifyContent: 'center' }}
            >
              <ListItemIcon
                sx={{
                  minWidth: !isCollapse ? 32 : 'auto',
                  ml: !isCollapse ? 'auto' : 0,
                }}
              >
                <ChevronLeft
                  style={{ transform: !isCollapse ? '' : 'rotate(180deg)' }}
                />
              </ListItemIcon>
              {!isCollapse ? (
                <ListItemText
                  primary={t('dashboard.collapse')}
                  primaryTypographyProps={{
                    color: 'grey.500',
                    variant: 'body2',
                  }}
                />
              ) : null}
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>
    </>
  );
};

export default SidebarDashboard;
