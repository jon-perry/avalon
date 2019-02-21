class Character {
    constructor(name, loyalty, seenByMerlin, seenByEvil, appearsAsMerlin) {
        this.name = name;
        this.loyalty = loyalty;
        this.seenByMerlin = seenByMerlin;
        this.seenByEvil =  seenByEvil;
        this.appearsAsMerlin = appearsAsMerlin;
    }

    getName = () => {
        return this.name;
    }

    getAlliance = () => {
        return this.loyalty;
    }

    isSeenByMerlin = () => {
        return this.seenByMerlin;
    }

    isSeenByEvil = () => {
        return this.seenByEvil;
    }

    isMerlin()
    
}