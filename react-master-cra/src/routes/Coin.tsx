import { Switch, Route, useLocation, useParams, Link, useRouteMatch, useHistory } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Price from './Price';
import Chart from './Chart';
import { useQuery } from 'react-query';
import { fetchCoinInfo, fetchCoinTickers } from '../api';
import { Helmet } from 'react-helmet';

// style component
const Container = styled.div`
    padding: 0 20px;
    max-width: 480px;
    margin: 0 auto;
`;
const Title = styled.h1`
    font-weight: 700;
    font-size: 36px;
    color : ${(props) => props.theme.accentColor};
`;
const Header = styled.header`
    height: 10vh;
    display: flex;
    justify-content: center;
    align-items: center;
`;
const Loader = styled.span`
    display: block;
    text-align: center; 
`;
const BtnWrap = styled.div`
    display: flex;
    justify-content: flex-end;
    margin-bottom: 20px;
`;
const BackBtn = styled.button`
    display: block;
    padding: 10px 20px;
    border-radius: 10px;
    outline: none;
    border: none;
    cursor: pointer;
`;
const Overview = styled.div`
    display: flex;
    justify-content: space-between;
    background-color:rgba(255,255,255,0.5);
    padding: 10px 20px;
    border-radius: 10px;
`;
const OverviewItem = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    span:first-child {
        font-size: 10px;
        font-weight: 700;
        text-transform: uppercase;
        margin-bottom: 5px;
    }
`;
const Description = styled.p`
    margin: 20px 0px;
`;

const Tabs = styled.ul`
    display: flex;
    margin: 20px 0;
    gap: 10px;
`;
const Tab = styled.li<{ isActive: boolean }>`
    flex: 1;
    border-radius: 10px;
    overflow: hidden;
    a{
        display: block; 
        padding: 10px;
        text-align: center;
        font-weight: 500;
        background-color: ${(props) => props.isActive ? '#fab1a0' : props.theme.accentColor};
        color: ${(props) => props.isActive ? props.theme.textColor : props.theme.bgColor};
    }
`;

// interface
interface RouteParams {
    coinId: string;
}
interface RouteState {
    name: string;
}
interface IInfoData {
    id: string;
    name: string;
    symbol: string;
    rank: number;
    is_new: boolean;
    is_active: boolean;
    type: string;
    contract: string;
    platform: string;
    logo: string;
    description: string;
    open_source: boolean;
    development_status: string;
    hardware_wallet: boolean;
    proof_type: string;
    org_structure: string;
    hash_algorithm: string;
    first_data_at: string;
    last_data_at: string;
}

interface IPriceData {
    id: string;
    name: string;
    symbol: string;
    rank: number;
    circulating_supply: number;
    total_supply: number;
    max_supply: number;
    beta_value: number;
    first_data_at: string;
    last_updated: string;
    quotes: {
        USD: {
            ath_date: string;
            ath_price: number;
            market_cap: number;
            market_cap_change_24h: number;
            percent_change_1h: number;
            percent_change_1y: number;
            percent_change_6h: number;
            percent_change_7d: number;
            percent_change_12h: number;
            percent_change_15m: number;
            percent_change_24h: number;
            percent_change_30d: number;
            percent_change_30m: number;
            percent_from_price_ath: number;
            price: number;
            volume_24h: number;
            volume_24h_change_24h: number;
        }
    };
}
// interface ICoinProps {
//     isDark: boolean;
// }

function Coin() {
    const { coinId } = useParams<RouteParams>();
    const { state } = useLocation<RouteState>();
    const priceMatch = useRouteMatch("/:coinId/price");
    const chartMatch = useRouteMatch("/:coinId/chart");
    const { isLoading: infoLoading, data: infoData } = useQuery<IInfoData>(["info", coinId], () => fetchCoinInfo(coinId));
    const { isLoading: tickersLoading, data: tickersData } = useQuery<IPriceData>(["tickers", coinId], () => fetchCoinTickers(coinId), {
        refetchInterval: 5000,
    });
    // const [loading, setLoaing] = useState(true);
    // const [info, setInfo] = useState<IInfoData>();
    // const [priceInfo, setPriceInfo] = useState<IPriceData>();

    // useEffect(() => {
    //     (async() => {
    //         const infoData = await (
    //             await fetch(`https://api.coinpaprika.com/v1/coins/${coinId}`)
    //         ).json();
    //         const priceData = await (
    //             await fetch(`https://api.coinpaprika.com/v1/tickers/${coinId}`)
    //         ).json();

    //         setInfo(infoData);
    //         setPriceInfo(priceData);
    //         setLoaing(false);
    //     })();
    // }, [coinId])
    const loading = infoLoading || tickersLoading;
    const history = useHistory();
    const backHistory = () => {
        history.push('/');
    };
    return (
        <Container>
            <Helmet>
                <title>{state?.name ? state.name : loading ? "Loading..." : infoData?.name}</title>
            </Helmet>
            <Header>
                <Title>
                    {state?.name ? state.name : loading ? "Loading..." : infoData?.name}
                </Title>
            </Header>
            {loading ? (
                <Loader>Loading...</Loader>
            ) : (
                <>
                    <BtnWrap>
                        <BackBtn onClick={backHistory}>
                            back
                        </BackBtn>
                    </BtnWrap>
                    <Overview>
                        <OverviewItem>
                            <span>Rank:</span>
                            <span>{infoData?.rank}</span>
                        </OverviewItem>
                        <OverviewItem>
                            <span>Symbol:</span>
                            <span>${infoData?.symbol}</span>
                        </OverviewItem>
                        <OverviewItem>
                            <span>Price</span>
                            <span>{tickersData?.quotes.USD.price.toFixed(2)}</span>
                        </OverviewItem>
                    </Overview>
                    <Description>{infoData?.description}</Description>
                    <Overview>
                        <OverviewItem>
                            <span>Total Suply:</span>
                            <span>{tickersData?.total_supply}</span>
                        </OverviewItem>
                        <OverviewItem>
                            <span>Max Supply:</span>
                            <span>{tickersData?.max_supply}</span>
                        </OverviewItem>
                    </Overview>
                    <Tabs>
                        <Tab isActive={priceMatch !== null}>
                            <Link to={`/${coinId}/price`}>
                                Price
                            </Link>
                        </Tab>
                        <Tab isActive={chartMatch !== null}>
                            <Link to={`/${coinId}/chart`}>
                                Chart
                            </Link>
                        </Tab>
                    </Tabs>
                    <Switch>
                        <Route path={`/${coinId}/price`}>
                            <Price coinId={coinId} />
                        </Route>
                        <Route path={`/${coinId}/chart`}>
                            <Chart coinId={coinId} />
                        </Route>
                    </Switch>
                </>
            )}
        </Container>
    )
}

export default Coin;