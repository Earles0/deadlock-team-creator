# Deadlock Lane Creator

A modern web application for creating balanced 6v6 lane matchups in Valve's Deadlock based on player ranks and MMR. Perfect for organizing custom games, scrimmages, and ensuring fair lane-by-lane competition.

## 🎮 About Deadlock

Deadlock is Valve's new MOBA/shooter hybrid game currently in alpha testing. The game features a comprehensive ranking system with 11 ranks, each having 6 sublevels, and uses a 6-lane map structure with 2 players per lane (6v6 total).

## 🗺️ Lane System

Deadlock uses a 6-lane map structure:
- **3 Lane Colors**: Purple, Green, Yellow
- **2 Lanes per Color**: Each color appears twice on the map
- **1v1 Lane Matchups**: Each lane has one player from each team
- **6 Players per Team**: Total of 12 players in a match

## 📊 Ranking System

The application supports all current Deadlock ranks with **official rank icons**:

1. **Initiate** (1000-1500 MMR)
2. **Seeker** (1600-2100 MMR)
3. **Alchemist** (2200-2700 MMR)
4. **Arcanist** (2800-3300 MMR)
5. **Ritualist** (3400-3900 MMR)
6. **Emissary** (4000-4500 MMR)
7. **Archon** (4600-5100 MMR)
8. **Oracle** (5200-5700 MMR)
9. **Phantom** (5800-6300 MMR)
10. **Ascendant** (6400-6900 MMR)
11. **Eternus** (7000+ MMR)

Each rank has 6 sublevels (I, II, III, IV, V, VI) that affect the exact MMR calculation.

## ✨ Features

- **🎯 Lane-by-Lane Balancing**: Advanced algorithm that balances each individual lane matchup
- **📈 Dual-Level Balance**: Overall team balance + individual lane balance scores
- **🖼️ Official Rank Icons**: Displays actual Deadlock rank badges from the game
- **🎨 Color-Coded Lanes**: Purple, Green, and Yellow lane themes matching Deadlock
- **📱 Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **⚡ Real-time Progress**: Visual progress bar showing player count (0/12)
- **🔄 Smart Algorithm**: Uses snake draft system for optimal team distribution
- **📊 Advanced Stats**: Individual lane balance percentages and overall team balance

## 🚀 How to Use

### 1. Open the Website
Simply open `index.html` in your web browser.

### 2. Add Players (Exactly 12 Required)
- Enter the player's name
- Select their current rank from the dropdown
- Choose their sublevel (I through VI)
- Click "Add Player" or press Enter
- **Progress bar** shows how many players you've added (0/12)

### 3. Create Lane Matchups
- Once you have exactly **12 players**, click "Create Lane Matchups"
- The algorithm will automatically balance both teams and individual lanes
- View detailed statistics for each lane and overall balance

### 4. Review Results
- **Overall Balance**: Team A vs Team B average MMR and balance score
- **Lane Balance**: Individual 1v1 matchup balance for each of the 6 lanes
- **Visual Layout**: Color-coded lanes (Purple, Green, Yellow) with player details

## 🧮 How the Lane Balancing Works

The lane balancing algorithm uses an advanced approach:

1. **Snake Draft Distribution**: Players are distributed using a snake draft pattern for optimal team balance
2. **MMR-Based Pairing**: Highest MMR players are paired against each other in lanes
3. **Dual Balance Calculation**: 
   - **Overall Team Balance**: Average MMR difference between teams
   - **Individual Lane Balance**: MMR difference for each 1v1 lane matchup
4. **Visual Feedback**: Color-coded balance scores for easy interpretation:
   - **Green (95%+)**: Excellent balance
   - **Light Green (85-94%)**: Good balance
   - **Orange (70-84%)**: Fair balance
   - **Red (<70%)**: Poor balance

## 🎨 Lane Color System

The application recreates Deadlock's lane structure:

- **Purple Lanes** (2): Defensive/Support focused lanes
- **Green Lanes** (2): Jungle/Farm focused lanes  
- **Yellow Lanes** (2): Aggressive/Push focused lanes

Each lane shows a direct 1v1 matchup with balance scoring.

## 🛠️ Technical Details

- **Frontend Only**: Pure HTML, CSS, and JavaScript - no server required
- **Official Assets**: Uses actual Deadlock rank icons from IGN Wiki
- **Modern Browser Support**: Uses CSS Grid, Flexbox, and modern JavaScript
- **Responsive**: Mobile-first design that scales beautifully
- **Performance**: Lightweight with smooth animations and transitions

## 🧪 Testing

To test the application with sample data, open the browser console and run:
```javascript
addSampleData()
```

This will add exactly 12 sample players with varied ranks for immediate testing.

## 📱 Browser Compatibility

- ✅ Chrome 80+
- ✅ Firefox 75+
- ✅ Safari 13+
- ✅ Edge 80+

## 🎯 Algorithm Features

### Snake Draft System
```
Round 1: Team A gets #1, Team A gets #2
Round 2: Team B gets #3, Team B gets #4
Round 3: Team A gets #5, Team A gets #6
... and so on
```

### Lane Pairing Logic
- Highest MMR vs Highest MMR
- 2nd Highest vs 2nd Highest
- Creates the most competitive 1v1 matchups

### Balance Scoring
- **Team Balance**: Measures overall team strength difference
- **Lane Balance**: Measures individual lane competitiveness
- **Visual Indicators**: Instant feedback on matchup quality

## 🔮 Future Enhancements

- **Hero Role Integration**: Account for player role preferences per lane
- **Historical Matchups**: Save and compare previous lane configurations
- **Tournament Bracket**: Multi-round tournament with lane rotation
- **Performance Tracking**: Win/loss tracking for lane matchups
- **Custom MMR**: Manual MMR adjustment for players
- **Team Templates**: Save common team configurations

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Feel free to contribute improvements, bug fixes, or new features! This is a community project for the Deadlock community.

---

**Note**: Deadlock is currently in alpha testing by Valve. Lane structure and rank information is based on the current state of the game as of November 2024 and may change as the game develops. Rank icons are sourced from official game assets via IGN's Deadlock Wiki. 