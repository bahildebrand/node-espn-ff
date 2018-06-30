import { IContentParser, IParseContext } from './ParserService';
import * as types from '../types';
import * as cheerio from 'cheerio';

export default class Standings implements IContentParser {
    public name: string = 'standings';

    parse(context: IParseContext): types.IFantasyTeam[] {
        let standings : types.IFantasyTeam[] = [];
        let teamRows = context.selector('tr.tableBody');
        let divisionRows = context.selector('tr.tableHead');

        let numDivisions = (divisionRows.length / 2);
        let teamsPerDivision = teamRows.length / numDivisions;
        let divisions = [];

        divisionRows.each((index, div) => {
            divisions.push(cheerio('td', div).text());
        });

        teamRows.each((index, row) => {
            let teamCell = cheerio('td:nth-of-type(1)', row);
            let teamStr = cheerio('a', teamCell).attr('title');
            let strSplit = teamStr.split('(');

            let name;
            let owner_name;
            // This catches teams that aren't assigned.
            if(strSplit.length == 2) {
                name = strSplit[0].trim();
                owner_name = strSplit[1].slice(0, -1);
            } else {
                name = strSplit;
                owner_name = '';
            }

            let team: types.IFantasyTeam = {
                id: 0,
                short_name: '',
                name: name,
                owner_name: owner_name,
                division: divisions[Math.floor(index/teamsPerDivision)],
                record: ''
            }
            standings.push(team);
        });

        console.log(standings);
        return standings;
    }
}
