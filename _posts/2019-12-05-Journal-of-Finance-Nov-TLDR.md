---
published: true
---
Where I read and concisely summarize 100s of pages from dry financial papers so you don't have to!

Caveat: I summarize the ones I find interesting gradually (an article/day). I'm biased towards market structure/markets. Think Duffie/Vayanos/Krishnamurthy.

# Paper #1: [Over-the-Counter Market Frictions and Yield Spread Changes](https://onlinelibrary.wiley.com/doi/pdf/10.1111/jofi.12827)



## My thoughts

This paper is interesting if you are in asset pricing. It provides an empirical proof for Duffie et. al in 2007 which discusses search frictions as a factor in yield variability.

It doesn't look too tough to implement parts of the paper even with public information, and might be valuable when assessing the efficiency of a specific capital market or the potential price of an asset/asset class if you have a view on certain factors (i.e. market concentration).

The paper also builds heavily on CDGM (2011), so it might be useful, though not necessary, to check that out.

## TLDR

| Who | [Nils Friewald](https://sites.google.com/site/nilsfriewald) and [Florian Nagler](https://sites.google.com/site/floriannagler/) |
| --- | --- |
| What | Empirical paper using US Corp Bonds in the Trade Reporting and Compliance Engine (TRACE) |
| Why | Explain (in more granularity) and support that search frictions explain yield spread variation |
| Result | Inventory, search\*, and bargaining\*\* frictions explain 23.4% of variation |

The authors here use secondary market US corporate bond info from TRACE by FINRA to verify Duffie, Garleanu, and Pederson (2005,2007), DGP's theory on deviations of prices from fundamentals through OTC market frictions. It contains 44 million intra day trades by 2,600 + dealers from 2003 - 2013.  This data looks like:

|    Date    |    ISIN    |    Price    |    Volume    |    Party    |    Counterparty    |
|------------|------------|-------------|--------------|-------------|--------------------|
|            |            |             |              |             |                    |

For Interdealer trades, the authors have info on coded identities. With customer-dealer trades, they only have the info on the dealer and that it is with a customer. They merge this with bond info from Mergent:

| ISIN | Offering amount | Offering date | Outstanding | Coupon Rate | Maturity | Credit Rating |
|------|-----------------|---------------|-------------|-------------|----------|---------------|
|      |                 |               |             |             |          |               |

Finally, they get info from Thomson Reuters eMAXX which has info on insurance companies, mutual funds, and pension funds and who they trade with.

## Dealing with inventory search frictions

**Bottom line: If there is more of an asset available, it will be cheaper.**

[CDGM (2001)](http://pages.stern.nyu.edu/~cedmond/phd/Collin-Dufresne%20et%20al%20JF%202001.pdf): show that basic variables (firm/macro vars) don't do a good job of explaining variability in yield spread changes.

That is, the factors are:

$$ \delta F_{i,t} := \delta LEV_{i,t}, \delta RF_t, (\delta RF_t)^2, \delta SLOPE_t, \delta VIX_t, \delta RM_t, \delta JUMP_t $$

Lev is leverage. Rf is risk free rate. Slope is changes in the yield curve slope. VIX is VIX. RM is SP500. JUMP is probability and magnitude of large negative jump in firm value using Black Scholes Merton (1973/74).

The authors run an OLS using the above as factors and find a similar story to CDGM: a mean adj. R^2 of 21.7% using the CDGM baseline regression model.

They also find using PCA that residuals are highly cross-correlated and have a large common component. In their PCA, <span style="color:blue">Component 1 captures 48.4% of variation! The next component only captures 9.5%.</span>

[LMN (2005)](http://dx.doi.org/10.1111/j.1540-6261.2005.00797.x), [CLW (2007)](http://dx.doi.org/10.1111/j.1540-6261.2007.01203.x), BPW(2011): proxy transaction costs related with yield spread changes (high level)

The authors go more granular, constructing proxies for systematic inventory, search, and bargaining frictions in the corp. bond market.

Stoll (1978), Ho and Stoll (1981, 1983): asset prices are inversely related to systematic inventory frictions (dealer inventories)

Vayanos (2002), Brunnermeier and Pederson (2009), Nagel (2012): asset prices inversely related to risk aversion and funding costs

The authors proxy aggregate order flow for increases in market-wide inventory and the TED spread for dealers' funding costs.

<span style="color:blue"> This explains 13.9% of the variation in the PCA component.</span>

## Dealing with systematic search frictions

**Bottomline: If an asset is easier to find and sell, it will be cheaper.**

DKS (2016): Dealers don't randomly search. They form trading networks to reduce these costs.

The authors proxy connectivity of dealers by using the graph-level [eigen centrality](https://en.wikipedia.org/wiki/Eigenvector_centrality) of the interdealer network.

Neklyudov (2014), Chang and Zhang (2016), Wang (2016): search frictions correlate with properties of intermediation chains.

HNS (2017), LS (2019): introduce intermediation chains.

SWY (2016), NS (2017): lower search costs lead to larger intermediary sector with longer chains

The authors identify generalized split intermediation chains by tracing bonds through the interdealer network after being sold by customers and before they go into portfolios: how?

1. Find number of dealers in a chain. Longer chain = smaller yield spread.
2. Proxy chains as meeting rates (required sales required to complete the chain.) More sales in larger sales = smaller yield spreads (i.e. dealers rely on large client base)

<span style="color:blue">This explains 6.3% of the variation in the PCA component.</span>

## Dealing with systematic bargaining frictions

**Bottomline: If dealers have more leverage vs. clients, yields spreads increase**

DGP: bargaining power of customers correlated with number of trading relationships with dealers

Randall (2015): marketwide fraction of blocktrades, correlated with better client bargaining power

LRW (2011), Feldhutter (2012), EJL (2011), Chen et. al (2014): dealer bargaining power correlated with demand shock to bonds due to investor mandates, regulation

The authors construct a [HH concentration index](https://www.investopedia.com/terms/h/hhi.asp) based on dealers' transaction volumes with customers. More concentration \implies less competitive dealer market \implies higher yield spreads.

<span style="color:blue">This explains 15.4% of the variation in the PCA component</span>

___

<span style="color:blue"> Jointly, they explain 23.4% of the variation in the PCA component. Search and bargaining capture 18% of variation, and inventory captures 13.9%. Compared to the initial CDGM model, the mean and median adjusted R^2s increase respectively by 9% and 14.4% to 30.7% and …?. This implies that OTC frictions account for 1/3 of total explained variation in yield spread changes.</span>
