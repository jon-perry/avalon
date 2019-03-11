import Cookies from 'js-cookie';

const COOKIES = {
    PLAYER: 'player',
}

class CookieService {

    static GetPlayer() {
        return JSON.parse(Cookies.get(COOKIES.PLAYER) || '{}');
    }

    static SetPlayer(player) {
        Cookies.set(COOKIES.PLAYER, player);
    }

}

export default CookieService;