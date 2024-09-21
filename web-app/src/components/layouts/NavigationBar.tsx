import EmailIcon from '@mui/icons-material/Email';
import MapIcon from '@mui/icons-material/Map';
import ThunderstormIcon from '@mui/icons-material/Thunderstorm';
import WbTwilightIcon from '@mui/icons-material/WbTwilight';
import LocalPoliceIcon from '@mui/icons-material/LocalPolice';
import LandslideIcon from '@mui/icons-material/Landslide';

import { BottomNavigation, BottomNavigationAction } from '@mui/material';
import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import SelectLanguage from 'src/modules/dashboard/component/SelectLanguage';

type NavigationBarProps = {};

export const sidebarData: Array<{
  value: string;
  label: string;
  icon: ReactNode;
}> = [
  {
    value: '',
    label: 'selectLanguage',
    icon: <SelectLanguage />,
  },
  {
    value: '/',
    label: 'map',
    icon: <MapIcon />,
  },
  {
    value: '/report',
    label: 'report',
    icon: <EmailIcon />,
  },
  {
    value: '/rain',
    label: 'rainfall',
    icon: <ThunderstormIcon />,
  },
  {
    value: '/sos',
    label: 'sosReport',
    icon: <WbTwilightIcon />,
  },
  {
    value: '/shelter',
    label: 'shelter',
    icon: <LocalPoliceIcon />,
  },
  {
    value: '/landslide',
    label: 'landslideArea',
    icon: <LandslideIcon />,
  },
];

const NavigationBar = (props: NavigationBarProps) => {
  const { t } = useTranslation();
  const { pathname } = useLocation();

  return (
    <div style={{ overflowX: 'auto' }}>
      <BottomNavigation showLabels value={pathname} sx={{ minHeight: 64 }}>
        {sidebarData.map((data, idx) => (
          <BottomNavigationAction
            key={idx}
            component={Link}
            to={data.value}
            value={data.value}
            label={t(`home.${data.label}`)}
            icon={data.icon}
            sx={{
              textAlign: 'center',
              whiteSpace: 'nowrap', // Prevents text wrapping
              textOverflow: 'ellipsis', // Truncates the text with an ellipsis if it overflows
              overflow: 'hidden', // Hides any overflowing text
              minWidth: 'unset', // Removes the minimum width constraint
              flex: '0 0 auto', // Allows the navigation items to shrink if needed
            }}
          />
        ))}
      </BottomNavigation>
    </div>
  );
};

export default NavigationBar;
