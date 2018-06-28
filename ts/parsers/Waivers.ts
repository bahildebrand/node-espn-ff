import { IContentParser, IParseContext } from './parserService';
import * as types from '../types';
import * as cheerio from 'cheerio';

export default class Waivers implements IContentParser {
    public name: string = 'waivers';

    parse(context: IParseContext): types.IPlayer[] {
        var table = context.selector('.playerTableTable');
        var playerRows = table.children('.pncPlayerRow');

        let players : types.IPlayer[] = [];

        playerRows.each((index, row) => {
            players.push(this.parseRow(row));
        });

        return players;
    }

    private parseRow(row: any): types.IPlayer {
        var playerDataStr = cheerio('td.playertablePlayerName', row).text();

        var strSplit = playerDataStr.split(',').map(p => p.trim());

        var playerName;
        var playerTeam;
        var playerPos;
        if(strSplit.length > 1) {
            playerName = strSplit[0];
            strSplit.splice(0,1);
        }

        var infoList;
        infoList = strSplit[0].replace(/[&]nbsp[;]/g," ").split(" ").filter(s => s != '');

        playerTeam = infoList[0];
        playerPos = infoList[1];
        if(infoList[1] == "D/ST") {
            playerName = infoList[0] + " D/ST";
        }

        var playerStatStr = cheerio('td.playertableStat', row).text();

        let player: types.IPlayer = {
            name: playerName,
            team: playerTeam,
            id: 1,
            position: playerPos,
            season_statistics: {
                player_rank: parseInt(cheerio('td:nth-of-type(9)', row).text()),
                total_points: this.checkPointValue(cheerio('td:nth-of-type(10)', row).text()),
                average_points: this.checkPointValue(cheerio('td:nth-of-type(11)', row).text()),
                last_game_points: this.checkPointValue(cheerio('td:nth-of-type(12)', row).text()),
                projected_points: this.checkPointValue(cheerio('td:nth-of-type(14)', row).text())
            }
        };

        return player;
    }

    private checkPointValue(points: string): number {
        return (points == '--') ? 0 : parseFloat(points);
    }

}