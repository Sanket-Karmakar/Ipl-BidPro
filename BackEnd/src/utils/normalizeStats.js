export function normalizeCricApiResponse(cricApiResponse) {
    if (!cricApiResponse || !cricApiResponse.id) {
        console.error("Invalid CricAPI response data provided for normalization.");
        return null;
    }

    // --- MatchType Mapping ---
    const matchTypeMap = {
        test: "Test",
        odi: "ODI",
        t20i: "T20I",
        ipl: "IPL",
        t20: "T20"
    };

    // --- Stat Key Mapping (normalize keys) ---
    const statKeyMap = {
        m: "matches",
        inn: "innings",
        no: "notOuts",
        runs: "runs",
        hs: "highScore",
        avg: "average",
        bf: "ballsFaced",
        sr: "strikeRate",
        "100s": "hundreds",
        "100": "hundreds",
        "200s": "doubleHundreds",
        "200": "doubleHundreds",
        "50s": "fifties",
        "50": "fifties",
        "4s": "fours",
        "6s": "sixes",
        wkts: "wickets",
        b: "ballsBowled",
        econ: "economy",
        bbi: "bestInnings",
        bbm: "bestMatch",
        "5w": "fiveWicketHaul",
        "10w": "tenWicketHaul"
    };

    // --- Stat Metadata (for units) ---
    const statMeta = {
        matches: { unit: "matches" },
        innings: { unit: "innings" },
        notOuts: { unit: "innings" },
        runs: { unit: "runs" },
        highScore: { unit: "runs" },
        average: { unit: "average" },
        strikeRate: { unit: "%" },
        ballsFaced: { unit: "balls" },
        fours: { unit: "fours" },
        sixes: { unit: "sixes" },
        fifties: { unit: "fifties" },
        hundreds: { unit: "hundreds" },
        doubleHundreds: { unit: "double hundreds" },
        ballsBowled: { unit: "balls" },
        wickets: { unit: "wickets" },
        economy: { unit: "econ" },
        bestInnings: { unit: "figures" },
        bestMatch: { unit: "figures" },
        fiveWicketHaul: { unit: "5-wicket hauls" },
        tenWicketHaul: { unit: "10-wicket hauls" }
    };

    const normalizedPlayer = {
        playerId: cricApiResponse.id,
        name: cricApiResponse.name,
        dateOfBirth: cricApiResponse.dateOfBirth ? new Date(cricApiResponse.dateOfBirth) : null,
        role: cricApiResponse.role,
        battingStyle: cricApiResponse.battingStyle || "",
        bowlingStyle: cricApiResponse.bowlingStyle || "",
        placeOfBirth: cricApiResponse.placeOfBirth || "",
        country: cricApiResponse.country || "",
        playerImg: cricApiResponse.playerImg || "",
        stats: []
    };

    const processedStats = new Set();

    (cricApiResponse.stats || []).forEach(apiStat => {
        // --- Clean input ---
        const fn = apiStat.fn ? apiStat.fn.trim().toLowerCase() : "";
        const rawMatchType = apiStat.matchtype ? apiStat.matchtype.trim().toLowerCase() : "";
        const rawStatKey = apiStat.stat ? apiStat.stat.trim() : "";
        const rawValue = apiStat.value ? apiStat.value.trim() : "";

        if (!fn || !rawMatchType || !rawStatKey) return;

        // --- Map match type ---
        const mappedMatchType = matchTypeMap[rawMatchType] || "Other";

        // --- Normalize stat key ---
        const normalizedStatKey = statKeyMap[rawStatKey.toLowerCase()] || rawStatKey;

        // --- Deduplication ---
        const uniqueKey = `${fn}-${mappedMatchType}-${normalizedStatKey}`;
        if (processedStats.has(uniqueKey)) return;
        processedStats.add(uniqueKey);

        // --- Numeric parsing ---
        let numericValue = 0;
        if (/^\d+\/\d+$/.test(rawValue)) {
            // Bowling figures like "2/25" → take first number (wickets)
            numericValue = parseInt(rawValue.split("/")[0], 10);
        } else if (!isNaN(parseFloat(rawValue))) {
            numericValue = parseFloat(rawValue);
        }

        // --- Unit inference ---
        const unit = statMeta[normalizedStatKey]?.unit || "";

        normalizedPlayer.stats.push({
            season: null, // CricAPI doesn’t give season → keep null
            matchType: mappedMatchType,
            fn,
            stat: normalizedStatKey,
            value: rawValue,
            numericValue,
            unit
        });
    });

    return normalizedPlayer;
<<<<<<< HEAD
}
=======
}
>>>>>>> 8970d6398f5b235d62f1f37d4f78b60eb448430e
