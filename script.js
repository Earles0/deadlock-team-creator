// Players data storage
let players = [];
let currentTeamAssignments = {}; // Track where each player is assigned

// MMR values for each rank (with subranks)
const rankValues = {
    initiate: { base: 1000, multiplier: 100 },
    seeker: { base: 1600, multiplier: 100 },
    alchemist: { base: 2200, multiplier: 100 },
    arcanist: { base: 2800, multiplier: 100 },
    ritualist: { base: 3400, multiplier: 100 },
    emissary: { base: 4000, multiplier: 100 },
    archon: { base: 4600, multiplier: 100 },
    oracle: { base: 5200, multiplier: 100 },
    phantom: { base: 5800, multiplier: 100 },
    ascendant: { base: 6400, multiplier: 100 },
    eternus: { base: 7000, multiplier: 100 }
};

// Rank icon URLs from IGN Deadlock Wiki
const rankIcons = {
    initiate: 'https://oyster.ignimgs.com/mediawiki/apis.ign.com/deadlock/f/f3/Initiate.png',
    seeker: 'https://oyster.ignimgs.com/mediawiki/apis.ign.com/deadlock/5/54/Seeker.png',
    alchemist: 'https://oyster.ignimgs.com/mediawiki/apis.ign.com/deadlock/5/5b/Alchemist.png',
    arcanist: 'https://oyster.ignimgs.com/mediawiki/apis.ign.com/deadlock/8/87/Arcanist.png',
    ritualist: 'https://oyster.ignimgs.com/mediawiki/apis.ign.com/deadlock/c/cb/Ritualist.png',
    emissary: 'https://oyster.ignimgs.com/mediawiki/apis.ign.com/deadlock/b/bc/Emissary.png',
    archon: 'https://oyster.ignimgs.com/mediawiki/apis.ign.com/deadlock/b/b7/Archon.png',
    oracle: 'https://oyster.ignimgs.com/mediawiki/apis.ign.com/deadlock/1/17/Oracle.png',
    phantom: 'https://oyster.ignimgs.com/mediawiki/apis.ign.com/deadlock/e/ec/Phantom.png',
    ascendant: 'https://oyster.ignimgs.com/mediawiki/apis.ign.com/deadlock/5/55/Ascendant.png',
    eternus: 'https://oyster.ignimgs.com/mediawiki/apis.ign.com/deadlock/c/c7/Eternus.png'
};

// DOM elements
const playerNameInput = document.getElementById('playerName');
const playerRankSelect = document.getElementById('playerRank');
const playerSubrankSelect = document.getElementById('playerSubrank');
const addPlayerBtn = document.getElementById('addPlayerBtn');
const playersList = document.getElementById('playersList');
const playerCount = document.getElementById('playerCount');
const createLanesBtn = document.getElementById('createLanesBtn');
const clearAllBtn = document.getElementById('clearAllBtn');
const quickTestBtn = document.getElementById('quickTestBtn');
const lanesSection = document.getElementById('lanesSection');
const progressFill = document.getElementById('progressFill');
const progressText = document.getElementById('progressText');
const teamAAvg = document.getElementById('teamAAvg');
const teamBAvg = document.getElementById('teamBAvg');
const overallBalance = document.getElementById('overallBalance');

// Lane elements
const laneElements = {
    yellow: {
        teamA1: document.getElementById('yellowLaneTeamA1'),
        teamA2: document.getElementById('yellowLaneTeamA2'),
        teamB1: document.getElementById('yellowLaneTeamB1'),
        teamB2: document.getElementById('yellowLaneTeamB2'),
        balance: document.getElementById('yellowLaneBalance')
    },
    blue: {
        teamA1: document.getElementById('blueLaneTeamA1'),
        teamA2: document.getElementById('blueLaneTeamA2'),
        teamB1: document.getElementById('blueLaneTeamB1'),
        teamB2: document.getElementById('blueLaneTeamB2'),
        balance: document.getElementById('blueLaneBalance')
    },
    purple: {
        teamA1: document.getElementById('purpleLaneTeamA1'),
        teamA2: document.getElementById('purpleLaneTeamA2'),
        teamB1: document.getElementById('purpleLaneTeamB1'),
        teamB2: document.getElementById('purpleLaneTeamB2'),
        balance: document.getElementById('purpleLaneBalance')
    }
};

// Calculate MMR from rank and subrank
function calculateMMR(rank, subrank) {
    const rankData = rankValues[rank];
    if (!rankData) return 1000;
    
    return rankData.base + (parseInt(subrank) - 1) * rankData.multiplier;
}

// Format rank display
function formatRank(rank, subrank) {
    const romanNumerals = ['I', 'II', 'III', 'IV', 'V', 'VI'];
    const capitalizedRank = rank.charAt(0).toUpperCase() + rank.slice(1);
    return `${capitalizedRank} ${romanNumerals[parseInt(subrank) - 1]}`;
}

// Get rank icon URL
function getRankIcon(rank) {
    return rankIcons[rank] || '';
}

// Add player to the list
function addPlayer() {
    const name = playerNameInput.value.trim();
    const rank = playerRankSelect.value;
    const subrank = playerSubrankSelect.value;
    
    if (!name || !rank) {
        alert('Please enter a player name and select a rank.');
        return;
    }
    
    if (players.length >= 12) {
        alert('Maximum 12 players allowed for 6v6 lane matchups.');
        return;
    }
    
    // Check if player already exists
    if (players.some(player => player.name.toLowerCase() === name.toLowerCase())) {
        alert('A player with this name already exists.');
        return;
    }
    
    const mmr = calculateMMR(rank, subrank);
    const player = {
        name,
        rank,
        subrank,
        mmr,
        id: Date.now() + Math.random()
    };
    
    players.push(player);
    updatePlayersList();
    updateProgress();
    clearForm();
    updateControls();
}

// Clear the form
function clearForm() {
    playerNameInput.value = '';
    playerRankSelect.value = '';
    playerSubrankSelect.value = '1';
    playerNameInput.focus();
}

// Remove player from the list
function removePlayer(playerId) {
    players = players.filter(player => player.id !== playerId);
    updatePlayersList();
    updateProgress();
    updateControls();
    hideLanes();
}

// Update progress bar
function updateProgress() {
    const progress = (players.length / 12) * 100;
    progressFill.style.width = `${progress}%`;
    progressText.textContent = `${players.length}/12 players`;
}

// Update the players list display
function updatePlayersList() {
    playerCount.textContent = players.length;
    
    if (players.length === 0) {
        playersList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-user-friends"></i>
                <p>No players added yet. Add 12 players to create lane matchups!</p>
            </div>
        `;
        return;
    }
    
    // Sort players by MMR (highest first)
    const sortedPlayers = [...players].sort((a, b) => b.mmr - a.mmr);
    
    playersList.innerHTML = sortedPlayers.map(player => `
        <div class="player-card">
            <div class="player-info">
                <span class="player-name">${player.name}</span>
                <span class="rank-badge rank-${player.rank}">
                    <img src="${getRankIcon(player.rank)}" alt="${player.rank}" class="rank-icon" onerror="this.style.display='none'">
                    ${formatRank(player.rank, player.subrank)}
                </span>
                <span class="mmr-value">${player.mmr} MMR</span>
            </div>
            <button class="remove-btn" onclick="removePlayer(${player.id})">
                <i class="fas fa-times"></i> Remove
            </button>
        </div>
    `).join('');
}

// Update control buttons state
function updateControls() {
    createLanesBtn.disabled = players.length !== 12;
}

// Clear all players
function clearAllPlayers() {
    if (players.length === 0) return;
    
    if (confirm('Are you sure you want to clear all players?')) {
        players = [];
        currentTeamAssignments = {};
        updatePlayersList();
        updateProgress();
        updateControls();
        hideLanes();
    }
}

// Hide lanes section
function hideLanes() {
    lanesSection.style.display = 'none';
}

// Show lanes section
function showLanes() {
    lanesSection.style.display = 'block';
}

// Calculate team average MMR
function calculateTeamAverage(team) {
    if (team.length === 0) return 0;
    const total = team.reduce((sum, player) => sum + player.mmr, 0);
    return Math.round(total / team.length);
}

// Get balance score color
function getBalanceScoreColor(percentage) {
    if (percentage >= 95) return '#4ecdc4'; // Excellent
    if (percentage >= 85) return '#2ecc71'; // Good
    if (percentage >= 70) return '#f39c12'; // Fair
    return '#e74c3c'; // Poor
}

// Calculate lane balance percentage for 2v2
function calculateLaneBalance(teamAPlayers, teamBPlayers) {
    if (!teamAPlayers || !teamBPlayers || teamAPlayers.length !== 2 || teamBPlayers.length !== 2) return 0;
    
    const teamATotal = teamAPlayers.reduce((sum, player) => sum + player.mmr, 0);
    const teamBTotal = teamBPlayers.reduce((sum, player) => sum + player.mmr, 0);
    const diff = Math.abs(teamATotal - teamBTotal);
    const avg = (teamATotal + teamBTotal) / 2;
    
    return avg > 0 ? Math.round((1 - diff / avg) * 100) : 100;
}

// Create lane matchups using improved balancing algorithm
function createLaneMatchups() {
    if (players.length !== 12) {
        alert('You need exactly 12 players to create lane matchups.');
        return;
    }
    
    // Sort players by MMR (highest first)
    const sortedPlayers = [...players].sort((a, b) => b.mmr - a.mmr);
    
    // Separate players into tiers for better distribution
    const highTier = sortedPlayers.slice(0, 4);    // Top 4 players
    const midTier = sortedPlayers.slice(4, 8);     // Middle 4 players
    const lowTier = sortedPlayers.slice(8, 12);    // Bottom 4 players
    
    // Helper function to balance a tier internally
    function balanceTier(tier) {
        // For 4 players [A, B, C, D] sorted high to low:
        // Best balance: TeamA gets [A, D] vs TeamB gets [B, C]
        // This pairs highest with lowest
        return {
            teamA: [tier[0], tier[3]], // 1st highest + 1st lowest
            teamB: [tier[1], tier[2]]  // 2nd highest + 2nd lowest
        };
    }
    
    // Create lanes with improved internal balancing
    const yellowBalance = balanceTier(highTier);
    const blueBalance = balanceTier(midTier);
    const purpleBalance = balanceTier(lowTier);
    
    const lanes = {
        yellow: yellowBalance,
        blue: blueBalance,
        purple: purpleBalance
    };
    
    // Log the balance for debugging
    console.log('Lane Balance Analysis:');
    Object.keys(lanes).forEach(laneKey => {
        const lane = lanes[laneKey];
        const teamATotal = lane.teamA.reduce((sum, p) => sum + p.mmr, 0);
        const teamBTotal = lane.teamB.reduce((sum, p) => sum + p.mmr, 0);
        const difference = Math.abs(teamATotal - teamBTotal);
        console.log(`${laneKey.toUpperCase()} Lane: TeamA=${teamATotal} vs TeamB=${teamBTotal}, Diff=${difference}`);
        console.log(`  TeamA: ${lane.teamA.map(p => `${p.name}(${p.mmr})`).join(', ')}`);
        console.log(`  TeamB: ${lane.teamB.map(p => `${p.name}(${p.mmr})`).join(', ')}`);
    });
    
    // Calculate team totals for overall balance
    const teamA = [...lanes.yellow.teamA, ...lanes.blue.teamA, ...lanes.purple.teamA];
    const teamB = [...lanes.yellow.teamB, ...lanes.blue.teamB, ...lanes.purple.teamB];
    
    const teamATotal = teamA.reduce((sum, p) => sum + p.mmr, 0);
    const teamBTotal = teamB.reduce((sum, p) => sum + p.mmr, 0);
    console.log(`Overall Balance: Sapphire Flame=${teamATotal} vs Amber Hand=${teamBTotal}, Diff=${Math.abs(teamATotal - teamBTotal)}`);
    
    displayLanes(lanes, teamA, teamB);
}

// Real-time balance calculation from current assignments
function recalculateBalanceFromAssignments() {
    // Get all current players from slots
    const allSlots = document.querySelectorAll('.player-slot .player-card-lane');
    const sapphireFlame = [];
    const amberHand = [];
    
    allSlots.forEach(playerElement => {
        const slot = playerElement.closest('.player-slot');
        const team = slot.dataset.team;
        const playerName = playerElement.querySelector('.player-name-lane').textContent;
        const player = players.find(p => p.name === playerName);
        
        if (player) {
            if (team === 'sapphire') {
                sapphireFlame.push(player);
            } else if (team === 'amber') {
                amberHand.push(player);
            }
        }
    });
    
    // Update overall team averages
    const sapphireAvg = calculateTeamAverage(sapphireFlame);
    const amberAvg = calculateTeamAverage(amberHand);
    const overallDifference = Math.abs(sapphireAvg - amberAvg);
    const maxAverage = Math.max(sapphireAvg, amberAvg);
    const overallBalancePercentage = maxAverage > 0 ? Math.round((1 - overallDifference / maxAverage) * 100) : 100;
    
    teamAAvg.textContent = `${sapphireAvg}`;
    teamBAvg.textContent = `${amberAvg}`;
    overallBalance.textContent = `${overallBalancePercentage}%`;
    overallBalance.style.color = getBalanceScoreColor(overallBalancePercentage);
    
    // Update individual lane balances
    ['yellow', 'blue', 'purple'].forEach(laneColor => {
        const laneElements = document.querySelectorAll(`[data-lane="${laneColor}"]`);
        const sapphireLane = [];
        const amberLane = [];
        
        laneElements.forEach(slot => {
            const playerElement = slot.querySelector('.player-card-lane');
            if (playerElement) {
                const playerName = playerElement.querySelector('.player-name-lane').textContent;
                const player = players.find(p => p.name === playerName);
                if (player) {
                    if (slot.dataset.team === 'sapphire') {
                        sapphireLane.push(player);
                    } else if (slot.dataset.team === 'amber') {
                        amberLane.push(player);
                    }
                }
            }
        });
        
        const laneBalance = calculateLaneBalance(sapphireLane, amberLane);
        const balanceElement = document.getElementById(`${laneColor}LaneBalance`);
        balanceElement.textContent = `${laneBalance}%`;
        balanceElement.style.color = getBalanceScoreColor(laneBalance);
    });
}

// NEW DRAG AND DROP SYSTEM
let draggedElement = null;
let draggedPlayerData = null;

// Create player content for a slot with new design
function createPlayerSlotContent(slot, playerData) {
    console.log('Creating player slot content for:', playerData.name, 'in slot:', slot.id);
    
    if (!slot) {
        console.error('No slot provided to createPlayerSlotContent');
        return;
    }
    
    if (!playerData) {
        console.error('No player data provided to createPlayerSlotContent');
        return;
    }
    
    // Clear the slot first
    slot.innerHTML = '';
    
    // Create the new player card structure
    const playerCard = document.createElement('div');
    playerCard.className = 'player-card-lane';
    playerCard.innerHTML = `
        <img src="${getRankIcon(playerData.rank)}" alt="${playerData.rank}" class="player-rank-icon" onerror="this.style.display='none'">
        <div class="player-info-lane">
            <div class="player-rank-text">${formatRank(playerData.rank, playerData.subrank)}</div>
            <div class="player-name-lane">${playerData.name}</div>
        </div>
    `;
    
    // Store player data
    playerCard.playerData = playerData;
    playerCard.dataset.playerId = playerData.id;
    
    // Enable dragging
    enableDragging(playerCard);
    
    // Add player card to slot
    slot.appendChild(playerCard);
    
    console.log('Successfully created player:', playerData.name, 'in slot:', slot.id);
    
    // Verify the element was added correctly
    setTimeout(() => {
        const verification = slot.querySelector('.player-card-lane');
        if (verification) {
            console.log('✓ Player card verified in slot:', slot.id);
        } else {
            console.error('✗ Player card NOT found in slot after creation:', slot.id);
        }
    }, 10);
}

// Enable dragging for a player element
function enableDragging(playerElement) {
    playerElement.draggable = true;
    playerElement.style.cursor = 'grab';
    
    playerElement.addEventListener('dragstart', handleDragStart);
    playerElement.addEventListener('dragend', handleDragEnd);
}

// Handle drag start
function handleDragStart(e) {
    draggedElement = this;
    draggedPlayerData = this.playerData;
    
    this.style.opacity = '0.5';
    this.style.cursor = 'grabbing';
    
    // Set drag effect
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', this.outerHTML);
    
    console.log('Started dragging:', draggedPlayerData.name);
}

// Handle drag end
function handleDragEnd(e) {
    this.style.opacity = '1';
    this.style.cursor = 'grab';
    
    // Clean up all visual feedback
    document.querySelectorAll('.player-slot').forEach(slot => {
        slot.classList.remove('drag-over');
    });
    
    console.log('Ended dragging:', draggedPlayerData?.name);
    
    // Clean up
    draggedElement = null;
    draggedPlayerData = null;
}

// Setup all drop zones
function setupDropZones() {
    const allSlots = document.querySelectorAll('.player-slot');
    console.log('Setting up drop zones for', allSlots.length, 'slots');
    
    allSlots.forEach(slot => {
        // Remove any existing listeners
        slot.removeEventListener('dragover', handleDragOver);
        slot.removeEventListener('dragenter', handleDragEnter);
        slot.removeEventListener('dragleave', handleDragLeave);
        slot.removeEventListener('drop', handleDrop);
        
        // Add new listeners
        slot.addEventListener('dragover', handleDragOver);
        slot.addEventListener('dragenter', handleDragEnter);
        slot.addEventListener('dragleave', handleDragLeave);
        slot.addEventListener('drop', handleDrop);
    });
}

// Handle drag over (required for drop to work)
function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
}

// Handle drag enter
function handleDragEnter(e) {
    e.preventDefault();
    if (draggedElement && this !== draggedElement.parentNode) {
        this.classList.add('drag-over');
    }
}

// Handle drag leave
function handleDragLeave(e) {
    // Only remove highlight if we're actually leaving the slot
    if (!this.contains(e.relatedTarget)) {
        this.classList.remove('drag-over');
    }
}

// Handle drop
function handleDrop(e) {
    e.preventDefault();
    this.classList.remove('drag-over');
    
    if (!draggedPlayerData || !draggedElement) {
        console.log('No dragged data available');
        return;
    }
    
    const sourceSlot = draggedElement.parentNode;
    const targetSlot = this;
    
    // Don't do anything if dropping on the same slot
    if (sourceSlot === targetSlot) {
        console.log('Dropped on same slot, ignoring');
        return;
    }
    
    console.log('Dropping', draggedPlayerData.name, 'from', sourceSlot.id, 'to', targetSlot.id);
    
    // Check if target slot has a player
    const targetPlayer = targetSlot.querySelector('.player-card-lane');
    
    if (targetPlayer && targetPlayer !== draggedElement) {
        // SWAP: Target slot has a different player
        const targetPlayerData = targetPlayer.playerData;
        console.log('Swapping with:', targetPlayerData.name);
        
        // Create new elements for both slots
        createPlayerSlotContent(sourceSlot, targetPlayerData);
        createPlayerSlotContent(targetSlot, draggedPlayerData);
    } else {
        // MOVE: Target slot is empty
        console.log('Moving to empty slot');
        
        // Clear source slot
        sourceSlot.innerHTML = '<div class="empty-player">Player</div>';
        
        // Create player in target slot
        createPlayerSlotContent(targetSlot, draggedPlayerData);
    }
    
    // Recalculate balance after the move
    setTimeout(() => {
        recalculateBalanceFromAssignments();
    }, 100);
}

// Test function for debugging
function testDragDrop() {
    const players = document.querySelectorAll('.player-card-lane');
    const slots = document.querySelectorAll('.player-slot');
    
    console.log('=== DRAG & DROP TEST ===');
    console.log('Players found:', players.length);
    console.log('Slots found:', slots.length);
    
    players.forEach((player, i) => {
        console.log(`Player ${i + 1}:`, {
            name: player.querySelector('.player-name-lane')?.textContent,
            draggable: player.draggable,
            hasData: !!player.playerData
        });
    });
    
    return { players: players.length, slots: slots.length };
}

// Expose test function
window.testDragDrop = testDragDrop;

// Event listeners
addPlayerBtn.addEventListener('click', addPlayer);
createLanesBtn.addEventListener('click', createLaneMatchups);
clearAllBtn.addEventListener('click', clearAllPlayers);
quickTestBtn.addEventListener('click', addSampleData);

// Enter key support for adding players
playerNameInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addPlayer();
    }
});

playerRankSelect.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addPlayer();
    }
});

playerSubrankSelect.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addPlayer();
    }
});

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    updatePlayersList();
    updateProgress();
    updateControls();
    playerNameInput.focus();
    
    // Setup drop zones for drag and drop
    setupDropZones();
    
    console.log('Deadlock Lane Creator initialized!');
    console.log('Add exactly 12 players to create balanced 6v6 lane matchups.');
    console.log('After creating teams, you can drag and drop players to adjust matchups!');
});

// Add sample data function (for testing purposes)
function addSampleData() {
    const samplePlayers = [
        { name: 'Alex', rank: 'archon', subrank: '3' },
        { name: 'Sarah', rank: 'oracle', subrank: '1' },
        { name: 'Mike', rank: 'ritualist', subrank: '5' },
        { name: 'Emma', rank: 'emissary', subrank: '2' },
        { name: 'John', rank: 'phantom', subrank: '4' },
        { name: 'Lisa', rank: 'ascendant', subrank: '1' },
        { name: 'David', rank: 'arcanist', subrank: '6' },
        { name: 'Sophie', rank: 'alchemist', subrank: '3' },
        { name: 'Ryan', rank: 'seeker', subrank: '4' },
        { name: 'Maria', rank: 'initiate', subrank: '6' },
        { name: 'Tom', rank: 'eternus', subrank: '2' },
        { name: 'Anna', rank: 'phantom', subrank: '1' }
    ];
    
    // Clear existing players first
    players = [];
    
    samplePlayers.forEach(player => {
        const mmr = calculateMMR(player.rank, player.subrank);
        players.push({
            name: player.name,
            rank: player.rank,
            subrank: player.subrank,
            mmr,
            id: Date.now() + Math.random()
        });
    });
    
    updatePlayersList();
    updateProgress();
    updateControls();
}

// Add 6 more players for full 12-player sample
function addFullSampleData() {
    addSampleData(); // This adds 12 players now
}

// Expose functions for testing
window.addSampleData = addSampleData;
window.addFullSampleData = addFullSampleData;

// Display the generated lanes
function displayLanes(lanes, teamA, teamB) {
    console.log('=== DISPLAYING LANES ===');
    console.log('Lanes data:', lanes);
    console.log('Lane elements:', laneElements);
    
    const teamAAverage = calculateTeamAverage(teamA);
    const teamBAverage = calculateTeamAverage(teamB);
    const overallDifference = Math.abs(teamAAverage - teamBAverage);
    const maxAverage = Math.max(teamAAverage, teamBAverage);
    const overallBalancePercentage = maxAverage > 0 ? Math.round((1 - overallDifference / maxAverage) * 100) : 100;
    
    // Update overall stats
    teamAAvg.textContent = `${teamAAverage}`;
    teamBAvg.textContent = `${teamBAverage}`;
    overallBalance.textContent = `${overallBalancePercentage}%`;
    overallBalance.style.color = getBalanceScoreColor(overallBalancePercentage);
    
    // Clear all slots first
    Object.keys(laneElements).forEach(laneKey => {
        const element = laneElements[laneKey];
        element.teamA1.innerHTML = '<div class="empty-player">Player 1</div>';
        element.teamA2.innerHTML = '<div class="empty-player">Player 2</div>';
        element.teamB1.innerHTML = '<div class="empty-player">Player 1</div>';
        element.teamB2.innerHTML = '<div class="empty-player">Player 2</div>';
    });
    
    // Display each lane
    Object.keys(lanes).forEach(laneKey => {
        const lane = lanes[laneKey];
        const element = laneElements[laneKey];
        
        console.log(`\n--- ${laneKey.toUpperCase()} LANE ---`);
        console.log('Lane data:', lane);
        console.log('Elements:', element);
        
        if (!element) {
            console.error(`No elements found for lane: ${laneKey}`);
            return;
        }
        
        // Verify we have all the player data
        if (!lane.teamA || !lane.teamB || lane.teamA.length !== 2 || lane.teamB.length !== 2) {
            console.error(`Invalid lane data for ${laneKey}:`, lane);
            return;
        }
        
        // Team A Player 1 (Sapphire Flame)
        console.log('Placing Team A Player 1:', lane.teamA[0].name, 'in', element.teamA1.id);
        createPlayerSlotContent(element.teamA1, lane.teamA[0]);
        
        // Team A Player 2 (Sapphire Flame)
        console.log('Placing Team A Player 2:', lane.teamA[1].name, 'in', element.teamA2.id);
        createPlayerSlotContent(element.teamA2, lane.teamA[1]);
        
        // Team B Player 1 (Amber Hand)
        console.log('Placing Team B Player 1:', lane.teamB[0].name, 'in', element.teamB1.id);
        createPlayerSlotContent(element.teamB1, lane.teamB[0]);
        
        // Team B Player 2 (Amber Hand)
        console.log('Placing Team B Player 2:', lane.teamB[1].name, 'in', element.teamB2.id);
        createPlayerSlotContent(element.teamB2, lane.teamB[1]);
        
        // Lane balance
        const laneBalance = calculateLaneBalance(lane.teamA, lane.teamB);
        element.balance.textContent = `${laneBalance}%`;
        element.balance.style.color = getBalanceScoreColor(laneBalance);
        
        console.log(`${laneKey} lane balance: ${laneBalance}%`);
    });
    
    // Show lanes first
    showLanes();
    
    // Setup drag and drop functionality with a slight delay
    console.log('Setting up drag and drop functionality...');
    setTimeout(() => {
        setupDropZones();
        
        // Debug: Check what we have after setup
        const dropZones = document.querySelectorAll('.drop-zone');
        const playerCards = document.querySelectorAll('.player-card-lane');
        console.log('=== POST-SETUP DEBUG ===');
        console.log('Drop zones found:', dropZones.length);
        console.log('Player cards found:', playerCards.length);
        
        // Verify each player card
        playerCards.forEach((card, index) => {
            const name = card.querySelector('.player-name-lane')?.textContent;
            const slot = card.closest('.player-slot');
            console.log(`Player card ${index + 1}: ${name} in slot ${slot?.id || 'unknown'}`);
            console.log('  - Draggable:', card.draggable);
            console.log('  - Has player data:', !!card.playerData);
            console.log('  - Visible:', !card.hidden && card.style.display !== 'none');
        });
    }, 100);
}

// Test function for debugging lane placement
function testLanePlacement() {
    console.log('=== LANE PLACEMENT TEST ===');
    
    // Check if all lane elements exist
    const laneKeys = ['yellow', 'blue', 'purple'];
    const teamKeys = ['teamA1', 'teamA2', 'teamB1', 'teamB2'];
    
    laneKeys.forEach(laneKey => {
        console.log(`\n--- ${laneKey.toUpperCase()} LANE ---`);
        const laneElement = laneElements[laneKey];
        
        if (!laneElement) {
            console.error(`❌ Lane element missing: ${laneKey}`);
            return;
        }
        
        teamKeys.forEach(teamKey => {
            const slot = laneElement[teamKey];
            if (!slot) {
                console.error(`❌ Slot missing: ${laneKey}.${teamKey}`);
                return;
            }
            
            const playerElement = slot.querySelector('.player-card-lane');
            const emptySlot = slot.querySelector('.empty-player');
            
            console.log(`${teamKey}: ${slot.id}`);
            console.log(`  - Element exists: ✓`);
            console.log(`  - Has player: ${playerElement ? '✓' : '❌'}`);
            console.log(`  - Has empty slot: ${emptySlot ? '✓' : '❌'}`);
            
            if (playerElement) {
                const playerName = playerElement.querySelector('.player-name-lane')?.textContent;
                console.log(`  - Player name: ${playerName}`);
                console.log(`  - Draggable: ${playerElement.draggable ? '✓' : '❌'}`);
                console.log(`  - Has data: ${playerElement.playerData ? '✓' : '❌'}`);
            }
        });
    });
    
    return {
        slotsFound: document.querySelectorAll('.player-slot').length,
        playersFound: document.querySelectorAll('.player-card-lane').length,
        emptySlots: document.querySelectorAll('.empty-player').length
    };
}

// Expose test function
window.testLanePlacement = testLanePlacement; 