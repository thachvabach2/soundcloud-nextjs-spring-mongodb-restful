export const createTrackSchema = (track: ITrackTop | null) => ({
    "@context": "http://schema.googleapis.com/",
    "@type": "MusicRecording",
    "@id": "https://open.spotify.com/track/210JJAa9nJOgNa0YNrsT5g",
    "url": "https://open.spotify.com/track/210JJAa9nJOgNa0YNrsT5g",
    "name": track?.title,
    "description": `Listen to ${track?.title} on Soundcloud. Song · ${track?.artist}`,
    "datePublished": "2023-10-04",
    "potentialAction": {
        "@type": "ListenAction",
        "target": [
            {
                "@type": "EntryPoint",
                "urlTemplate": "https://open.spotify.com/track/210JJAa9nJOgNa0YNrsT5g?autoplay=true",
                "actionPlatform": [
                    "http://schema.org/DesktopWebPlatform",
                    "http://schema.org/IOSPlatform",
                    "http://schema.googleapis.com/GoogleAudioCast",
                    "http://schema.googleapis.com/GoogleVideoCast"
                ]
            },
            "android-app://com.spotify.music/spotify/track/210JJAa9nJOgNa0YNrsT5g/play"
        ],
        "expectsAcceptanceOf": {
            "@type": "Offer",
            "category": "free",
            "eligibleRegion": [
                {
                    "@type": "Country",
                    "name": "AR"
                },
                {
                    "@type": "Country",
                    "name": "AU"
                },
                {
                    "@type": "Country",
                    "name": "AT"
                },
                {
                    "@type": "Country",
                    "name": "BE"
                },
                {
                    "@type": "Country",
                    "name": "BO"
                },
                {
                    "@type": "Country",
                    "name": "BR"
                },
                {
                    "@type": "Country",
                    "name": "BG"
                },
                {
                    "@type": "Country",
                    "name": "CA"
                },
                {
                    "@type": "Country",
                    "name": "CL"
                },
                {
                    "@type": "Country",
                    "name": "CO"
                },
                {
                    "@type": "Country",
                    "name": "CR"
                },
                {
                    "@type": "Country",
                    "name": "CY"
                },
                {
                    "@type": "Country",
                    "name": "CZ"
                },
                {
                    "@type": "Country",
                    "name": "DK"
                },
                {
                    "@type": "Country",
                    "name": "DO"
                },
                {
                    "@type": "Country",
                    "name": "DE"
                },
                {
                    "@type": "Country",
                    "name": "EC"
                },
                {
                    "@type": "Country",
                    "name": "EE"
                },
                {
                    "@type": "Country",
                    "name": "SV"
                },
                {
                    "@type": "Country",
                    "name": "FI"
                },
                {
                    "@type": "Country",
                    "name": "FR"
                },
                {
                    "@type": "Country",
                    "name": "GR"
                },
                {
                    "@type": "Country",
                    "name": "GT"
                },
                {
                    "@type": "Country",
                    "name": "HN"
                },
                {
                    "@type": "Country",
                    "name": "HK"
                },
                {
                    "@type": "Country",
                    "name": "HU"
                },
                {
                    "@type": "Country",
                    "name": "IS"
                },
                {
                    "@type": "Country",
                    "name": "IE"
                },
                {
                    "@type": "Country",
                    "name": "IT"
                },
                {
                    "@type": "Country",
                    "name": "LV"
                },
                {
                    "@type": "Country",
                    "name": "LT"
                },
                {
                    "@type": "Country",
                    "name": "LU"
                },
                {
                    "@type": "Country",
                    "name": "MY"
                },
                {
                    "@type": "Country",
                    "name": "MT"
                },
                {
                    "@type": "Country",
                    "name": "MX"
                },
                {
                    "@type": "Country",
                    "name": "NL"
                },
                {
                    "@type": "Country",
                    "name": "NZ"
                },
                {
                    "@type": "Country",
                    "name": "NI"
                },
                {
                    "@type": "Country",
                    "name": "NO"
                },
                {
                    "@type": "Country",
                    "name": "PA"
                },
                {
                    "@type": "Country",
                    "name": "PY"
                },
                {
                    "@type": "Country",
                    "name": "PE"
                },
                {
                    "@type": "Country",
                    "name": "PH"
                },
                {
                    "@type": "Country",
                    "name": "PL"
                },
                {
                    "@type": "Country",
                    "name": "PT"
                },
                {
                    "@type": "Country",
                    "name": "SG"
                },
                {
                    "@type": "Country",
                    "name": "SK"
                },
                {
                    "@type": "Country",
                    "name": "ES"
                },
                {
                    "@type": "Country",
                    "name": "SE"
                },
                {
                    "@type": "Country",
                    "name": "CH"
                },
                {
                    "@type": "Country",
                    "name": "TW"
                },
                {
                    "@type": "Country",
                    "name": "TR"
                },
                {
                    "@type": "Country",
                    "name": "UY"
                },
                {
                    "@type": "Country",
                    "name": "US"
                },
                {
                    "@type": "Country",
                    "name": "GB"
                },
                {
                    "@type": "Country",
                    "name": "AD"
                },
                {
                    "@type": "Country",
                    "name": "LI"
                },
                {
                    "@type": "Country",
                    "name": "MC"
                },
                {
                    "@type": "Country",
                    "name": "ID"
                },
                {
                    "@type": "Country",
                    "name": "JP"
                },
                {
                    "@type": "Country",
                    "name": "TH"
                },
                {
                    "@type": "Country",
                    "name": "VN"
                },
                {
                    "@type": "Country",
                    "name": "RO"
                },
                {
                    "@type": "Country",
                    "name": "IL"
                },
                {
                    "@type": "Country",
                    "name": "ZA"
                },
                {
                    "@type": "Country",
                    "name": "SA"
                },
                {
                    "@type": "Country",
                    "name": "AE"
                },
                {
                    "@type": "Country",
                    "name": "BH"
                },
                {
                    "@type": "Country",
                    "name": "QA"
                },
                {
                    "@type": "Country",
                    "name": "OM"
                },
                {
                    "@type": "Country",
                    "name": "KW"
                },
                {
                    "@type": "Country",
                    "name": "EG"
                },
                {
                    "@type": "Country",
                    "name": "MA"
                },
                {
                    "@type": "Country",
                    "name": "DZ"
                },
                {
                    "@type": "Country",
                    "name": "TN"
                },
                {
                    "@type": "Country",
                    "name": "LB"
                },
                {
                    "@type": "Country",
                    "name": "JO"
                },
                {
                    "@type": "Country",
                    "name": "PS"
                },
                {
                    "@type": "Country",
                    "name": "IN"
                },
                {
                    "@type": "Country",
                    "name": "BY"
                },
                {
                    "@type": "Country",
                    "name": "KZ"
                },
                {
                    "@type": "Country",
                    "name": "MD"
                },
                {
                    "@type": "Country",
                    "name": "UA"
                },
                {
                    "@type": "Country",
                    "name": "AL"
                },
                {
                    "@type": "Country",
                    "name": "BA"
                },
                {
                    "@type": "Country",
                    "name": "HR"
                },
                {
                    "@type": "Country",
                    "name": "ME"
                },
                {
                    "@type": "Country",
                    "name": "MK"
                },
                {
                    "@type": "Country",
                    "name": "RS"
                },
                {
                    "@type": "Country",
                    "name": "SI"
                },
                {
                    "@type": "Country",
                    "name": "KR"
                },
                {
                    "@type": "Country",
                    "name": "BD"
                },
                {
                    "@type": "Country",
                    "name": "PK"
                },
                {
                    "@type": "Country",
                    "name": "LK"
                },
                {
                    "@type": "Country",
                    "name": "GH"
                },
                {
                    "@type": "Country",
                    "name": "KE"
                },
                {
                    "@type": "Country",
                    "name": "NG"
                },
                {
                    "@type": "Country",
                    "name": "TZ"
                },
                {
                    "@type": "Country",
                    "name": "UG"
                },
                {
                    "@type": "Country",
                    "name": "AG"
                },
                {
                    "@type": "Country",
                    "name": "AM"
                },
                {
                    "@type": "Country",
                    "name": "BS"
                },
                {
                    "@type": "Country",
                    "name": "BB"
                },
                {
                    "@type": "Country",
                    "name": "BZ"
                },
                {
                    "@type": "Country",
                    "name": "BT"
                },
                {
                    "@type": "Country",
                    "name": "BW"
                },
                {
                    "@type": "Country",
                    "name": "BF"
                },
                {
                    "@type": "Country",
                    "name": "CV"
                },
                {
                    "@type": "Country",
                    "name": "CW"
                },
                {
                    "@type": "Country",
                    "name": "DM"
                },
                {
                    "@type": "Country",
                    "name": "FJ"
                },
                {
                    "@type": "Country",
                    "name": "GM"
                },
                {
                    "@type": "Country",
                    "name": "GE"
                },
                {
                    "@type": "Country",
                    "name": "GD"
                },
                {
                    "@type": "Country",
                    "name": "GW"
                },
                {
                    "@type": "Country",
                    "name": "GY"
                },
                {
                    "@type": "Country",
                    "name": "HT"
                },
                {
                    "@type": "Country",
                    "name": "JM"
                },
                {
                    "@type": "Country",
                    "name": "KI"
                },
                {
                    "@type": "Country",
                    "name": "LS"
                },
                {
                    "@type": "Country",
                    "name": "LR"
                },
                {
                    "@type": "Country",
                    "name": "MW"
                },
                {
                    "@type": "Country",
                    "name": "MV"
                },
                {
                    "@type": "Country",
                    "name": "ML"
                },
                {
                    "@type": "Country",
                    "name": "MH"
                },
                {
                    "@type": "Country",
                    "name": "FM"
                },
                {
                    "@type": "Country",
                    "name": "NA"
                },
                {
                    "@type": "Country",
                    "name": "NR"
                },
                {
                    "@type": "Country",
                    "name": "NE"
                },
                {
                    "@type": "Country",
                    "name": "PW"
                },
                {
                    "@type": "Country",
                    "name": "PG"
                },
                {
                    "@type": "Country",
                    "name": "PR"
                },
                {
                    "@type": "Country",
                    "name": "WS"
                },
                {
                    "@type": "Country",
                    "name": "SM"
                },
                {
                    "@type": "Country",
                    "name": "ST"
                },
                {
                    "@type": "Country",
                    "name": "SN"
                },
                {
                    "@type": "Country",
                    "name": "SC"
                },
                {
                    "@type": "Country",
                    "name": "SL"
                },
                {
                    "@type": "Country",
                    "name": "SB"
                },
                {
                    "@type": "Country",
                    "name": "KN"
                },
                {
                    "@type": "Country",
                    "name": "LC"
                },
                {
                    "@type": "Country",
                    "name": "VC"
                },
                {
                    "@type": "Country",
                    "name": "SR"
                },
                {
                    "@type": "Country",
                    "name": "TL"
                },
                {
                    "@type": "Country",
                    "name": "TO"
                },
                {
                    "@type": "Country",
                    "name": "TT"
                },
                {
                    "@type": "Country",
                    "name": "TV"
                },
                {
                    "@type": "Country",
                    "name": "VU"
                },
                {
                    "@type": "Country",
                    "name": "AZ"
                },
                {
                    "@type": "Country",
                    "name": "BN"
                },
                {
                    "@type": "Country",
                    "name": "BI"
                },
                {
                    "@type": "Country",
                    "name": "KH"
                },
                {
                    "@type": "Country",
                    "name": "CM"
                },
                {
                    "@type": "Country",
                    "name": "TD"
                },
                {
                    "@type": "Country",
                    "name": "KM"
                },
                {
                    "@type": "Country",
                    "name": "GQ"
                },
                {
                    "@type": "Country",
                    "name": "SZ"
                },
                {
                    "@type": "Country",
                    "name": "GA"
                },
                {
                    "@type": "Country",
                    "name": "GN"
                },
                {
                    "@type": "Country",
                    "name": "KG"
                },
                {
                    "@type": "Country",
                    "name": "LA"
                },
                {
                    "@type": "Country",
                    "name": "MO"
                },
                {
                    "@type": "Country",
                    "name": "MR"
                },
                {
                    "@type": "Country",
                    "name": "MN"
                },
                {
                    "@type": "Country",
                    "name": "NP"
                },
                {
                    "@type": "Country",
                    "name": "RW"
                },
                {
                    "@type": "Country",
                    "name": "TG"
                },
                {
                    "@type": "Country",
                    "name": "UZ"
                },
                {
                    "@type": "Country",
                    "name": "ZW"
                },
                {
                    "@type": "Country",
                    "name": "BJ"
                },
                {
                    "@type": "Country",
                    "name": "MG"
                },
                {
                    "@type": "Country",
                    "name": "MU"
                },
                {
                    "@type": "Country",
                    "name": "MZ"
                },
                {
                    "@type": "Country",
                    "name": "AO"
                },
                {
                    "@type": "Country",
                    "name": "CI"
                },
                {
                    "@type": "Country",
                    "name": "DJ"
                },
                {
                    "@type": "Country",
                    "name": "ZM"
                },
                {
                    "@type": "Country",
                    "name": "CD"
                },
                {
                    "@type": "Country",
                    "name": "CG"
                },
                {
                    "@type": "Country",
                    "name": "IQ"
                },
                {
                    "@type": "Country",
                    "name": "LY"
                },
                {
                    "@type": "Country",
                    "name": "TJ"
                },
                {
                    "@type": "Country",
                    "name": "VE"
                },
                {
                    "@type": "Country",
                    "name": "ET"
                },
                {
                    "@type": "Country",
                    "name": "XK"
                }
            ]
        }
    }
});