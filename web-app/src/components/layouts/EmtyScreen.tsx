import { ReactComponent as EmptyIcon } from '../../assets/icons/Empty.svg';
import { ReactComponent as SearchEmptyIcon } from '../../assets/icons/SearchEmpty.svg';
import { Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

interface EmptyScreenProps {
  titleEmpty?: string;
  searchKey?: string;
  isSearch?: boolean;
}
export default function EmptyScreen({
  titleEmpty,
  searchKey,
  isSearch,
}: EmptyScreenProps) {
  const { t } = useTranslation();
  return (
    <Stack
      direction="column"
      justifyContent="center"
      alignItems="center"
      height="100%"
      // px={8}
      my={4}
    >
      {titleEmpty ? (
        <>
          <EmptyIcon width={160} height={160} />
          <Typography variant="h4" textAlign="center">
            {titleEmpty}
          </Typography>
        </>
      ) : isSearch ? (
        <>
          <SearchEmptyIcon width={160} height={160} />
          {searchKey ? (
            <Typography variant="h4" textAlign="center">
              {t('general.noResultsFound')} "{searchKey}"
            </Typography>
          ) : (
            <Typography variant="h4" textAlign="center">
              {t('general.enterInformationToSearch')}
            </Typography>
          )}
        </>
      ) : (
        <>
          <EmptyIcon width={160} height={160} />
          <Typography variant="h4">{t('general.noDataAvailable')}</Typography>
        </>
      )}
    </Stack>
  );
}
