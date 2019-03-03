const whoCharacterCanSee = {
    'Loyal Servant of Aurthor': [],
    'Merlin': [
        'Minion of Mordred',
        'Oberon',
        'Assassin',
        'Morgana'
    ],
    'Percival': [
        'Merlin',
        'Morgana'
    ],
    'Assassin': [
        'Minion of Mordred',
        'Mordred',
        'Morgana',
    ],
    'Minion of Mordred': [
        'Assassin',
        'Mordred',
        'Morgana'
    ],
    'Mordred': [
        'Assassin',
        'Minion of Mordred',
        'Morgana'
    ],
    'Morgana': [
        'Assassin',
        'Minion of Mordred',
        'Mordred',
        'Morgana'
    ],
    'Oberon': []
}



class Character {
    constructor(name, loyalty, seenByMerlin, seenByEvil, appearsAsMerlin) {
        this.name = name;
        this.loyalty = loyalty;
        this.seenByMerlin = seenByMerlin;
        this.seenByEvil = seenByEvil;
        this.appearsAsMerlin = appearsAsMerlin;
    }

    getName = () => {
        return this.name;
    }

    getAlliance = () => {
        return this.loyalty;
    }
}