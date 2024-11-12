import React from 'react';
import {
  Container,
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
} from '@mui/material';
import { useTranslation } from 'react-i18next';

export function AdsPage() {
  const { t } = useTranslation();

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h2" component="h1" gutterBottom>
          {t('adsPage.title', 'Welcome to Our Amazing Product!')}
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom>
          {t(
            'adsPage.subtitle',
            'Discover the features and benefits of our product.'
          )}
        </Typography>
        <Button variant="contained" color="primary" size="large" sx={{ mt: 2 }}>
          {t('adsPage.cta', 'Get Started Now')}
        </Button>
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardMedia
              component="img"
              height="140"
              image="https://via.placeholder.com/300"
              alt="Feature 1"
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                {t('adsPage.feature1.title', 'Feature 1')}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t('adsPage.feature1.description', 'Description of feature 1.')}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardMedia
              component="img"
              height="140"
              image="https://via.placeholder.com/300"
              alt="Feature 2"
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                {t('adsPage.feature2.title', 'Feature 2')}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t('adsPage.feature2.description', 'Description of feature 2.')}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardMedia
              component="img"
              height="140"
              image="https://via.placeholder.com/300"
              alt="Feature 3"
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                {t('adsPage.feature3.title', 'Feature 3')}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t('adsPage.feature3.description', 'Description of feature 3.')}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}
