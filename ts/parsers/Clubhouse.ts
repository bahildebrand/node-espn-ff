import { IContentParser, IParseContext } from './ParserService';
import * as types from '../types';
import * as cheerio from 'cheerio';

export default class ClubhouseParser implements IContentParser {

    public name: string = 'clubhouse';

    parse(context: IParseContext): types.IRoster {


        let rosterTable = context.selector('.playerTableTable');
        if (rosterTable.length === 0) { return null; }

        let roster: types.IRoster = {
            starters: [],
            bench: [],
            week: 0
        };

        let activeSlotSet : types.IRosterSlot[] = null;

        rosterTable.children('tr').each((index, element) => {
            // Look for pncPlayerRow  for players and tableHead  for start vs bench seperation

            if (!element.attribs || !element.attribs['class']) {
                return;
            }

            // Header
            if (element.attribs['class'].indexOf('tableHead') >= 0) {
                if (activeSlotSet == null) {
                    // Pull out the week number
                    let weekText = cheerio('th:nth-of-type(2)', <any>element).text();
                    roster.week = parseInt(weekText.split(' ')[1]);
                    activeSlotSet = roster.starters;
                }
                else {
                    activeSlotSet = roster.bench;
                }

                return;
            }

            // Player
            if (element.attribs['class'].indexOf('pncPlayerRow') >= 0) {
                const player = this.parseRosterSlot(element);
                activeSlotSet.push(player);
            }
        });

        return roster;
    }

    private parseRosterSlot(element: any): types.IRosterSlot {

        let rosterSlot: types.IRosterSlot = {
            slot: cheerio('.playerSlot', element).text(),
            player: this.parsePlayer(element),
            gameStart: cheerio('.gameStatusDiv', element).text(),
            matchup: this.parsePlayerMatchup(element),
            opponent: cheerio('td:nth-child(5)', element).text() // Slot + player + action + seperator
        }

        return rosterSlot;
    }

    private parsePlayer(element: any): types.IPlayer {
        let playerName = cheerio('.playertablePlayerName', element);
        let playerText = playerName.text();
        let team = 'N/A';

        if(playerText.indexOf(',') > 0) {
            // Human player
            let parts = playerText.split(',').map(p => p.trim());
            playerText = parts[0];
            team = parts[1].split('&nbsp;')[0];
        }

        playerText = playerText.split('&nbsp;')[0];
        return {
            name: playerText,
            team: team,
            id: 1,
            season_statistics: {
                player_rank: this.checkPointValue(cheerio('td:nth-of-type(7)', element).text()),
                total_points: this.checkPointValue(cheerio('td:nth-of-type(8)', element).text()),
                average_points: this.checkPointValue(cheerio('td:nth-of-type(9)', element).text()),
                last_game_points: this.checkPointValue(cheerio('td:nth-of-type(10)', element).text()),
                projected_points: 1
            }
        };
    }

    private parsePlayerMatchup(element: any): types.IPlayerMatchup {

        let oppenent_rank : any = cheerio('td:nth-of-type(13)', element).text();

        // Empty slot
        if(oppenent_rank == '--') {
            return null;
        }

        oppenent_rank = parseInt(/([0-9]+)/.exec(oppenent_rank)[0]);

        return {
            projected_or_current_points: this.checkPointValue(cheerio('td:nth-of-type(12)', element).text()),
            opponent_rank: oppenent_rank,
            percent_start: this.checkPointValue(cheerio('td:nth-of-type(14)', element).text()),
            percent_own: this.checkPointValue(cheerio('td:nth-of-type(15)', element).text()),
            percent_own_delta: this.checkPointValue(cheerio('td:nth-of-type(16)', element).text())
        }
    }

    private checkPointValue(points: string): number {
        return (points == '--') ? 0 : parseFloat(points);
    }
}