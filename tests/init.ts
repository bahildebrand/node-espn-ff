import EspnFantasyFootball from "./../ts/EspnFantasyFootball";

const cookies = {
    espnS2: 'AEBn2fbqwW3CPWsWz8Epsz4rQuKV0gCNlznSzlOyuNNwoqcRkSVAlyqrtb5bYKM%2FuhtPKehMgjy7%2FOR8q%2BJ%2BUh1n878Rohm7%2FDeIzpb9yzvBVfLDahgPAx5TNNRWZSASHSouZ76FrVGOV1s02LL37HvRi5eOVnU9gfdU90cxBMmEGFMK%2B543UT2HZ1%2FspYXKIUiiiyaeoaVEo6p9vBsXd%2B1ZEYjMw2eiSMVSARMl5UckbDKg4QpCsZo9JvW0cj3bBoPlXDxvm2rqNBynW9R%2BA2QZWj%2Fyq5xTo7DLW1AToM%2BrZg%3D%3D',
    SWID: '{0A1F16CC-9894-4030-887B-022E9A9A5C18}'
}

export const scraper = new EspnFantasyFootball({
    leagueId: 106980, //Test league I created for this purpose.
    cookies
});