import bitsgapInstance from './axios.js';

export default {
    strategies: "/strategy",
    exchanges: "/exchanges/list",
    dcaBots: "/bot/dca?userId=",
    gridBots: "/bot/grid/manual?userId=",
    dcaBot: "/bot/dca",
    dcaBotStart: "/bot/dca/start",
    gridBotStart: "/bot/grid/start",
    gridBotStop: "/bot/grid/stop",
    dcaBotStop: "/bot/dca/stop",
    createGridBot:"/bot/grid/manual",
    exchangeBalances: "/exchanges/assets/balances"
}