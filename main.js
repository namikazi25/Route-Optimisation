(function () {
    "use strict";
    
    // Get API key from configuration file
    const GOOGLE_MAPS_API_KEY = CONFIG.GOOGLE_MAPS_API_KEY;

    // Distance matrix data
    const distanceMatrix = {
        "Birmingham": { "lat": 52.4862, "lng": -1.8904, "Birmingham": 0, "London": 120, "Manchester": 90, "Glasgow": 300, "Edinburgh": 330, "Cardiff": 150, "Bristol": 90, "Leeds": 90, "Liverpool": 90, "Newcastle": 210, "Sheffield": 60, "Nottingham": 60, "Southampton": 180, "Plymouth": 270, "Belfast": 390 },
        "London": { "lat": 51.5074, "lng": -0.1278, "Birmingham": 120, "London": 0, "Manchester": 240, "Glasgow": 400, "Edinburgh": 420, "Cardiff": 180, "Bristol": 120, "Leeds": 200, "Liverpool": 220, "Newcastle": 280, "Sheffield": 180, "Nottingham": 150, "Southampton": 90, "Plymouth": 240, "Belfast": 480 },
        "Manchester": { "lat": 53.4808, "lng": -2.2426, "Birmingham": 90, "London": 240, "Manchester": 0, "Glasgow": 220, "Edinburgh": 250, "Cardiff": 210, "Bristol": 180, "Leeds": 60, "Liverpool": 45, "Newcastle": 150, "Sheffield": 75, "Nottingham": 90, "Southampton": 270, "Plymouth": 360, "Belfast": 300 },
        "Glasgow": { "lat": 55.8642, "lng": -4.2518, "Birmingham": 300, "London": 400, "Manchester": 220, "Glasgow": 0, "Edinburgh": 60, "Cardiff": 450, "Bristol": 400, "Leeds": 270, "Liverpool": 240, "Newcastle": 180, "Sheffield": 300, "Nottingham": 330, "Southampton": 480, "Plymouth": 550, "Belfast": 90 },
        "Edinburgh": { "lat": 55.9533, "lng": -3.1883, "Birmingham": 330, "London": 420, "Manchester": 250, "Glasgow": 60, "Edinburgh": 0, "Cardiff": 480, "Bristol": 430, "Leeds": 290, "Liverpool": 270, "Newcastle": 120, "Sheffield": 320, "Nottingham": 350, "Southampton": 500, "Plymouth": 580, "Belfast": 150 },
        "Cardiff": { "lat": 51.4816, "lng": -3.1791, "Birmingham": 150, "London": 180, "Manchester": 210, "Glasgow": 450, "Edinburgh": 480, "Cardiff": 0, "Bristol": 60, "Leeds": 270, "Liverpool": 240, "Newcastle": 360, "Sheffield": 240, "Nottingham": 210, "Southampton": 150, "Plymouth": 150, "Belfast": 420 },
        "Bristol": { "lat": 51.4545, "lng": -2.5879, "Birmingham": 90, "London": 120, "Manchester": 180, "Glasgow": 400, "Edinburgh": 430, "Cardiff": 60, "Bristol": 0, "Leeds": 240, "Liverpool": 210, "Newcastle": 330, "Sheffield": 210, "Nottingham": 180, "Southampton": 90, "Plymouth": 120, "Belfast": 390 },
        "Leeds": { "lat": 53.8008, "lng": -1.5491, "Birmingham": 90, "London": 200, "Manchester": 60, "Glasgow": 270, "Edinburgh": 290, "Cardiff": 270, "Bristol": 240, "Leeds": 0, "Liverpool": 80, "Newcastle": 120, "Sheffield": 40, "Nottingham": 70, "Southampton": 290, "Plymouth": 380, "Belfast": 320 },
        "Liverpool": { "lat": 53.4084, "lng": -2.9916, "Birmingham": 90, "London": 220, "Manchester": 45, "Glasgow": 240, "Edinburgh": 270, "Cardiff": 240, "Bristol": 210, "Leeds": 80, "Liverpool": 0, "Newcastle": 180, "Sheffield": 90, "Nottingham": 110, "Southampton": 300, "Plymouth": 390, "Belfast": 180 },
        "Newcastle": { "lat": 54.9783, "lng": -1.6174, "Birmingham": 210, "London": 280, "Manchester": 150, "Glasgow": 180, "Edinburgh": 120, "Cardiff": 360, "Bristol": 330, "Leeds": 120, "Liverpool": 180, "Newcastle": 0, "Sheffield": 150, "Nottingham": 180, "Southampton": 360, "Plymouth": 450, "Belfast": 240 },
        "Sheffield": { "lat": 53.3811, "lng": -1.4701, "Birmingham": 60, "London": 180, "Manchester": 75, "Glasgow": 300, "Edinburgh": 320, "Cardiff": 240, "Bristol": 210, "Leeds": 40, "Liverpool": 90, "Newcastle": 150, "Sheffield": 0, "Nottingham": 40, "Southampton": 240, "Plymouth": 330, "Belfast": 300 },
        "Nottingham": { "lat": 52.9548, "lng": -1.1581, "Birmingham": 60, "London": 150, "Manchester": 90, "Glasgow": 330, "Edinburgh": 350, "Cardiff": 210, "Bristol": 180, "Leeds": 70, "Liverpool": 110, "Newcastle": 180, "Sheffield": 40, "Nottingham": 0, "Southampton": 210, "Plymouth": 300, "Belfast": 330 },
        "Southampton": { "lat": 50.9097, "lng": -1.4044, "Birmingham": 180, "London": 90, "Manchester": 270, "Glasgow": 480, "Edinburgh": 500, "Cardiff": 150, "Bristol": 90, "Leeds": 290, "Liverpool": 300, "Newcastle": 360, "Sheffield": 240, "Nottingham": 210, "Southampton": 0, "Plymouth": 120, "Belfast": 450 },
        "Plymouth": { "lat": 50.3755, "lng": -4.1427, "Birmingham": 270, "London": 240, "Manchester": 360, "Glasgow": 550, "Edinburgh": 580, "Cardiff": 150, "Bristol": 120, "Leeds": 380, "Liverpool": 390, "Newcastle": 450, "Sheffield": 330, "Nottingham": 300, "Southampton": 120, "Plymouth": 0, "Belfast": 540 },
        "Belfast": { "lat": 54.5973, "lng": -5.9301, "Birmingham": 390, "London": 480, "Manchester": 300, "Glasgow": 90, "Edinburgh": 150, "Cardiff": 420, "Bristol": 390, "Leeds": 320, "Liverpool": 180, "Newcastle": 240, "Sheffield": 300, "Nottingham": 330, "Southampton": 450, "Plymouth": 540, "Belfast": 0 }
    };

    const depot = "Birmingham";
    const allLocations = Object.keys(distanceMatrix).filter(loc => loc !== depot);
    let selectedLocations = [];
    let map = null;
    let markers = [];
    let polylines = [];
    let optimizationResults = null;
    
    // Global COLORS array for truck route visualization
    const COLORS = ['#FF0000', '#0000FF', '#008000', '#FFA500', '#800080', '#00CED1', '#FFD700', '#ADFF2F'];

    // Utility functions
    function getDistance(from, to) {
        if (distanceMatrix[from] && distanceMatrix[from][to] !== undefined) {
            return distanceMatrix[from][to];
        }
        return Infinity;
    }

    function getLocationCoords(locationName) {
        return { lat: distanceMatrix[locationName]?.lat, lng: distanceMatrix[locationName]?.lng };
    }

    function loadGoogleMapsScript(apiKey, callback) {
        if (window.google) {
            callback();
            return;
        }
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initMap`;
        script.async = true;
        script.defer = true;
        window.initMap = callback;
        document.head.appendChild(script);
    }

    // Route optimization algorithm
    function simulateOROptimization(depot, locations, numTrucks, maxCapacity, maxTravelTime) {
        if (!locations || locations.length === 0) {
            return { routes: [], totalDistance: 0, totalTime: 0, unassignedLocations: [], suggestions: [] };
        }

        const shuffledLocations = [...locations].sort(() => 0.5 - Math.random());

        const routes = Array.from({ length: numTrucks }, () => ({
            path: [depot],
            currentLoad: 0,
            currentTime: 0,
            totalDistance: 0,
            totalTime: 0
        }));
        let unassignedLocations = [...shuffledLocations];
        let constraintViolations = {
            capacityBlocked: 0,
            timeBlocked: 0,
            noValidRoutes: 0
        };

        let iterationCount = 0;
        const maxIterations = locations.length * numTrucks * 2;

        while (unassignedLocations.length > 0 && iterationCount < maxIterations) {
            let bestTruckIndex = -1;
            let bestLocationIndex = -1;
            let minIncrease = Infinity;
            let blockedByCapacity = 0;
            let blockedByTime = 0;

            for (let i = 0; i < numTrucks; i++) {
                const currentTruck = routes[i];
                const lastLocation = currentTruck.path[currentTruck.path.length - 1];

                for (let j = 0; j < unassignedLocations.length; j++) {
                    const nextLocation = unassignedLocations[j];
                    const travelTime = getDistance(lastLocation, nextLocation);
                    const newTime = currentTruck.currentTime + travelTime;
                    const newLoad = currentTruck.currentLoad + 1;

                    if (travelTime !== Infinity) {
                        if (newLoad > maxCapacity) {
                            blockedByCapacity++;
                        } else if (newTime > maxTravelTime) {
                            blockedByTime++;
                        } else if (travelTime < minIncrease) {
                            minIncrease = travelTime;
                            bestTruckIndex = i;
                            bestLocationIndex = j;
                        }
                    }
                }
            }

            if (bestTruckIndex !== -1 && bestLocationIndex !== -1) {
                const assignedLocation = unassignedLocations.splice(bestLocationIndex, 1)[0];
                const truck = routes[bestTruckIndex];
                const lastLocationOnTruck = truck.path[truck.path.length - 1];
                const travelTime = getDistance(lastLocationOnTruck, assignedLocation);

                truck.path.push(assignedLocation);
                truck.currentLoad += 1;
                truck.currentTime += travelTime;
                truck.totalDistance += travelTime;
                truck.totalTime += travelTime;
            } else {
                constraintViolations.capacityBlocked += blockedByCapacity;
                constraintViolations.timeBlocked += blockedByTime;
                constraintViolations.noValidRoutes++;
                break;
            }
            iterationCount++;
        }

        let overallTotalDistance = 0;
        let overallTotalTime = 0;

        routes.forEach(route => {
            if (route.path.length > 1) {
                const lastLocation = route.path[route.path.length - 1];
                const returnTime = getDistance(lastLocation, depot);
                if (returnTime !== Infinity) {
                    route.path.push(depot);
                    route.totalDistance += returnTime;
                    route.totalTime += returnTime;
                }
            }
            overallTotalDistance += route.totalDistance;
            overallTotalTime += route.totalTime;
        });

        // Generate intelligent suggestions
        const suggestions = generateOptimizationSuggestions(
            unassignedLocations.length,
            locations.length,
            numTrucks,
            maxCapacity,
            maxTravelTime,
            constraintViolations,
            routes
        );

        return { routes, totalDistance: overallTotalDistance, totalTime: overallTotalTime, unassignedLocations, suggestions };
    }

    function generateOptimizationSuggestions(unassignedCount, totalLocations, currentTrucks, currentCapacity, currentTravelTime, violations, routes) {
        const suggestions = [];
        
        if (unassignedCount === 0) {
            return suggestions; // No suggestions needed if all locations are assigned
        }

        const unassignedPercentage = (unassignedCount / totalLocations) * 100;
        const avgLocationsPerTruck = totalLocations / currentTrucks;
        const maxRouteTime = Math.max(...routes.map(r => r.totalTime));
        const avgRouteTime = routes.reduce((sum, r) => sum + r.totalTime, 0) / routes.length;

        // Analyze primary constraint violations
        if (violations.capacityBlocked > violations.timeBlocked) {
            // Capacity is the main constraint
            if (unassignedPercentage > 30) {
                const suggestedTrucks = Math.ceil(totalLocations / currentCapacity);
                suggestions.push({
                    type: 'trucks',
                    priority: 'high',
                    current: currentTrucks,
                    suggested: Math.max(suggestedTrucks, currentTrucks + Math.ceil(unassignedCount / currentCapacity)),
                    reason: `${unassignedCount} locations unassigned due to capacity limits. Each truck can only handle ${currentCapacity} deliveries.`,
                    impact: `Adding trucks will distribute the load more evenly.`
                });
            } else {
                const suggestedCapacity = Math.ceil(avgLocationsPerTruck * 1.2);
                suggestions.push({
                    type: 'capacity',
                    priority: 'medium',
                    current: currentCapacity,
                    suggested: Math.max(suggestedCapacity, currentCapacity + 2),
                    reason: `Capacity constraint is preventing optimal assignment of ${unassignedCount} locations.`,
                    impact: `Increasing capacity per truck will allow more efficient routes.`
                });
            }
        } else if (violations.timeBlocked > violations.capacityBlocked) {
            // Time is the main constraint
            const suggestedTime = Math.ceil(maxRouteTime * 1.3);
            suggestions.push({
                type: 'time',
                priority: 'high',
                current: currentTravelTime,
                suggested: Math.max(suggestedTime, currentTravelTime + 120),
                reason: `${unassignedCount} locations unassigned due to travel time limits. Current max route time: ${maxRouteTime.toFixed(0)} minutes.`,
                impact: `Extending travel time will allow trucks to reach more distant locations.`
            });
        } else {
            // Mixed constraints or insufficient trucks
            if (unassignedPercentage > 20) {
                suggestions.push({
                    type: 'trucks',
                    priority: 'high',
                    current: currentTrucks,
                    suggested: currentTrucks + Math.ceil(unassignedCount / Math.max(currentCapacity - 1, 1)),
                    reason: `${unassignedCount} locations cannot be assigned with current truck fleet.`,
                    impact: `Additional trucks will provide more routing flexibility.`
                });
            }
        }

        // Secondary suggestions for optimization
        if (maxRouteTime > currentTravelTime * 0.9 && suggestions.length === 0) {
            suggestions.push({
                type: 'time',
                priority: 'low',
                current: currentTravelTime,
                suggested: currentTravelTime + 60,
                reason: `Routes are approaching time limits (max: ${maxRouteTime.toFixed(0)} minutes).`,
                impact: `Small time increase will provide buffer for route optimization.`
            });
        }

        // Efficiency suggestions
        if (avgLocationsPerTruck < 2 && currentTrucks > 1) {
            suggestions.push({
                type: 'efficiency',
                priority: 'low',
                current: currentTrucks,
                suggested: Math.max(1, Math.ceil(totalLocations / 3)),
                reason: `Current truck utilization is low (avg ${avgLocationsPerTruck.toFixed(1)} locations per truck).`,
                impact: `Reducing trucks and increasing capacity might be more efficient.`
            });
        }

        return suggestions.slice(0, 3); // Return top 3 suggestions
    }

    // UI functions
    function showModal(message) {
        document.getElementById('modalMessage').textContent = message;
        document.getElementById('modal').classList.remove('hidden');
    }

    function closeModal() {
        document.getElementById('modal').classList.add('hidden');
    }

    function showError(message) {
        document.getElementById('errorMessage').textContent = message;
        document.getElementById('errorDisplay').classList.remove('hidden');
    }

    function hideError() {
        document.getElementById('errorDisplay').classList.add('hidden');
    }

    function setLoading(loading) {
        const btn = document.getElementById('optimizeBtn');
        if (loading) {
            btn.innerHTML = `
                <span class="flex items-center justify-center">
                    <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Optimizing...
                </span>
            `;
            btn.disabled = true;
            btn.classList.add('bg-indigo-300', 'cursor-not-allowed');
            btn.classList.remove('bg-indigo-600', 'hover:bg-indigo-700');
        } else {
            btn.innerHTML = 'Optimize Routes';
            btn.disabled = false;
            btn.classList.remove('bg-indigo-300', 'cursor-not-allowed');
            btn.classList.add('bg-indigo-600', 'hover:bg-indigo-700');
        }
    }

    function populateLocationGrid() {
        const grid = document.getElementById('locationGrid');
        grid.innerHTML = '';
        
        allLocations.forEach(location => {
            const label = document.createElement('label');
            label.className = 'inline-flex items-center text-gray-700 cursor-pointer';
            
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.value = location;
            checkbox.className = 'form-checkbox h-4 w-4 text-indigo-600 rounded focus:ring-indigo-500 transition duration-150 ease-in-out';
            checkbox.addEventListener('change', handleLocationChange);
            
            const span = document.createElement('span');
            span.className = 'ml-2 text-sm';
            span.textContent = location;
            
            label.appendChild(checkbox);
            label.appendChild(span);
            grid.appendChild(label);
        });
    }

    function handleLocationChange(e) {
        const { value, checked } = e.target;
        if (checked) {
            selectedLocations.push(value);
        } else {
            selectedLocations = selectedLocations.filter(loc => loc !== value);
        }
    }

    function initializeMap() {
        if (GOOGLE_MAPS_API_KEY === 'YOUR_GOOGLE_MAPS_API_KEY') {
            showModal('Please replace "YOUR_GOOGLE_MAPS_API_KEY" with your actual Google Maps API Key in the code for the map to work.');
            return;
        }
        
        loadGoogleMapsScript(GOOGLE_MAPS_API_KEY, () => {
            if (!map) {
                map = new window.google.maps.Map(document.getElementById('map'), {
                    center: { lat: 53.00, lng: -2.00 },
                    zoom: 6,
                    fullscreenControl: true,
                    streetViewControl: true,
                    mapTypeControl: true,
                    mapTypeControlOptions: {
                        style: window.google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
                        position: window.google.maps.ControlPosition.TOP_CENTER,
                    },
                    zoomControl: true,
                    zoomControlOptions: {
                        position: window.google.maps.ControlPosition.RIGHT_CENTER
                    },
                    scaleControl: true,
                    rotateControl: true,
                    styles: [
                        {
                            featureType: "poi",
                            elementType: "labels",
                            stylers: [{ visibility: "off" }]
                        },
                        {
                            featureType: "transit",
                            elementType: "labels",
                            stylers: [{ visibility: "off" }]
                        }
                    ]
                });
            }
        });
    }

    function updateMapVisualization() {
        if (!map || !optimizationResults) return;

        // Clear previous markers and polylines
        markers.forEach(marker => marker.setMap(null));
        polylines.forEach(polyline => polyline.setMap(null));
        markers = [];
        polylines = [];

        const bounds = new window.google.maps.LatLngBounds();

        // Add depot marker with custom icon
        const depotCoords = getLocationCoords(depot);
        if (depotCoords.lat && depotCoords.lng) {
            const depotMarker = new window.google.maps.Marker({
                position: depotCoords,
                map: map,
                title: `Depot: ${depot}`,
                icon: {
                    path: window.google.maps.SymbolPath.CIRCLE,
                    scale: 15,
                    fillColor: '#FF0000',
                    fillOpacity: 1,
                    strokeColor: '#FFFFFF',
                    strokeWeight: 3
                },
                label: {
                    text: 'DEPOT',
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '10px',
                },
                zIndex: 1000
            });
            
            // Add info window for depot
            const depotInfoWindow = new window.google.maps.InfoWindow({
                content: `<div style="padding: 8px;"><strong>Depot Location</strong><br/>${depot}<br/>Starting point for all routes</div>`
            });
            
            depotMarker.addListener('click', () => {
                depotInfoWindow.open(map, depotMarker);
            });
            
            markers.push(depotMarker);
            bounds.extend(depotCoords);
        }



        // Add markers for locations and draw polylines for routes
        optimizationResults.routes.forEach((route, truckIndex) => {
            const pathCoords = route.path.map(locName => getLocationCoords(locName)).filter(c => c.lat && c.lng);

            if (pathCoords.length > 1) {
                const truckColor = COLORS[truckIndex % COLORS.length];
                const polyline = new window.google.maps.Polyline({
                    path: pathCoords,
                    geodesic: true,
                    strokeColor: truckColor,
                    strokeOpacity: 0.9,
                    strokeWeight: 5,
                    icons: [{
                        icon: {
                            path: window.google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                            scale: 3,
                            fillColor: truckColor,
                            fillOpacity: 1,
                            strokeColor: '#FFFFFF',
                            strokeWeight: 1
                        },
                        offset: '100%',
                        repeat: '50px'
                    }]
                });
                polyline.setMap(map);
                polylines.push(polyline);
                
                // Add click listener to polyline for route info
                polyline.addListener('click', (event) => {
                    const routeInfoWindow = new window.google.maps.InfoWindow({
                        content: `<div style="padding: 8px;">
                            <strong>Truck ${truckIndex + 1} Route</strong><br/>
                            <span style="color: ${truckColor};">■</span> ${route.path.join(' → ')}<br/>
                            Total Time: ${route.totalTime.toFixed(2)} minutes<br/>
                            Stops: ${route.path.length - 2} locations
                        </div>`,
                        position: event.latLng
                    });
                    routeInfoWindow.open(map);
                });
            }

            route.path.forEach((locName, pathIndex) => {
                if (locName !== depot) {
                    const coords = getLocationCoords(locName);
                    if (coords.lat && coords.lng) {
                        const truckColor = COLORS[truckIndex % COLORS.length];
                        const marker = new window.google.maps.Marker({
                            position: coords,
                            map: map,
                            title: `${locName} (Truck ${truckIndex + 1}, Stop ${pathIndex})`,
                            icon: {
                                path: window.google.maps.SymbolPath.CIRCLE,
                                scale: 10,
                                fillColor: truckColor,
                                fillOpacity: 0.8,
                                strokeColor: '#FFFFFF',
                                strokeWeight: 2
                            },
                            label: {
                                text: `${pathIndex}`,
                                color: 'white',
                                fontWeight: 'bold',
                                fontSize: '12px',
                            },
                            zIndex: 100 + pathIndex
                        });
                        
                        // Add info window for delivery location
                        const infoWindow = new window.google.maps.InfoWindow({
                            content: `<div style="padding: 8px; min-width: 150px;">
                                <strong>${locName}</strong><br/>
                                <span style="color: ${truckColor};">■</span> Truck ${truckIndex + 1}<br/>
                                Stop #${pathIndex}<br/>
                                <small>Click marker to see details</small>
                            </div>`
                        });
                        
                        marker.addListener('click', () => {
                            // Close all other info windows
                            markers.forEach(m => {
                                if (m.infoWindow) m.infoWindow.close();
                            });
                            infoWindow.open(map, marker);
                        });
                        
                        marker.infoWindow = infoWindow;
                        markers.push(marker);
                        bounds.extend(coords);
                    }
                }
            });
        });

        // Fit map to bounds of all markers
        if (!bounds.isEmpty()) {
            map.fitBounds(bounds);
            const listener = window.google.maps.event.addListener(map, 'idle', function() {
                if (map.getZoom() > 15) map.setZoom(15);
                window.google.maps.event.removeListener(listener);
            });
        }
        
        // Update legend
        updateMapLegend();
    }
    
    function updateMapLegend() {
        if (!optimizationResults) return;
        
        const legendItems = document.getElementById('legendItems');
        const mapLegend = document.getElementById('mapLegend');
        
        legendItems.innerHTML = '';
        
        optimizationResults.routes.forEach((route, index) => {
            if (route.path.length > 1) {
                const color = COLORS[index % COLORS.length];
                const legendItem = document.createElement('div');
                legendItem.className = 'flex items-center';
                legendItem.innerHTML = `
                    <div class="w-4 h-1 mr-2" style="background-color: ${color};"></div>
                    <span>Truck ${index + 1} (${route.path.length - 2} stops)</span>
                `;
                legendItems.appendChild(legendItem);
            }
        });
        
        mapLegend.classList.remove('hidden');
     }

    function displayResults(results) {
        optimizationResults = results;
        
        document.getElementById('totalDistance').textContent = results.totalDistance.toFixed(2);
        document.getElementById('totalTime').textContent = results.totalTime.toFixed(2);

        // Handle unassigned locations
        const unassignedWarning = document.getElementById('unassignedWarning');
        const unassignedList = document.getElementById('unassignedList');
        
        // Clear any existing suggestions
        const existingSuggestions = unassignedWarning.parentNode.querySelector('.bg-blue-50');
        if (existingSuggestions) {
            existingSuggestions.remove();
        }
        
        // Clear any existing what-if experiments
        const existingWhatIf = unassignedWarning.parentNode.querySelector('.bg-green-50');
        if (existingWhatIf) {
            existingWhatIf.remove();
        }
        
        // Run what-if experiments if there are unassigned locations
        if (results.unassignedLocations.length > 0) {
            const baseConfig = {
                numTrucks: parseInt(document.getElementById('numTrucks').value) || 1,
                maxCapacity: parseInt(document.getElementById('maxCapacity').value) || 1,
                maxTravelTime: parseInt(document.getElementById('maxTravelTime').value) || 60,
                currentUnassigned: results.unassignedLocations.length,
                currentTotalTime: results.totalTime
            };
            
            const whatIfSuggestions = runWhatIfExperiments(baseConfig);
            
            if (whatIfSuggestions.length > 0) {
                const whatIfDiv = document.createElement('div');
                whatIfDiv.className = 'bg-green-50 border border-green-200 rounded-lg p-4 mb-4';
                whatIfDiv.innerHTML = `
                    <h4 class="text-green-800 font-semibold mb-3">🧪 What-If Experiments</h4>
                    <p class="text-green-700 text-sm mb-3">Based on automated testing, here are parameter adjustments that could improve your results:</p>
                    <div class="space-y-3">
                        ${whatIfSuggestions.map((suggestion, index) => {
                            const improvement = baseConfig.currentUnassigned - suggestion.unassigned;
                            const timeChange = suggestion.totalTime - baseConfig.currentTotalTime;
                            return `
                                <div class="bg-white border border-green-300 rounded-lg p-3">
                                    <div class="flex items-start justify-between mb-2">
                                        <div class="font-medium text-green-800">Try: ${suggestion.description}</div>
                                        <span class="text-xs px-2 py-1 bg-green-100 text-green-800 rounded font-semibold">Rank #${index + 1}</span>
                                    </div>
                                    <div class="text-sm text-green-700 mb-2">
                                        ${suggestion.unassigned === 0 ? 
                                            '✅ Would assign ALL locations!' : 
                                            `📍 ${improvement} fewer unassigned locations`
                                        }
                                    </div>
                                    <div class="text-xs text-green-600 mb-2">
                                        Total time: ${suggestion.totalTime.toFixed(0)} min 
                                        ${timeChange > 0 ? `(+${timeChange.toFixed(0)} min)` : `(${timeChange.toFixed(0)} min)`}
                                    </div>
                                    <div class="flex gap-2">
                                        ${suggestion.tweak.trucks ? `
                                            <button onclick="applySuggestion('trucks', ${suggestion.config.numTrucks})" 
                                                    class="px-3 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700 transition-colors">
                                                Set ${suggestion.config.numTrucks} Trucks
                                            </button>
                                        ` : ''}
                                        ${suggestion.tweak.time ? `
                                            <button onclick="applySuggestion('time', ${suggestion.config.maxTravelTime})" 
                                                    class="px-3 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700 transition-colors">
                                                Set ${suggestion.config.maxTravelTime} Min
                                            </button>
                                        ` : ''}
                                        ${suggestion.tweak.capacity ? `
                                            <button onclick="applySuggestion('capacity', ${suggestion.config.maxCapacity})" 
                                                    class="px-3 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700 transition-colors">
                                                Set ${suggestion.config.maxCapacity} Capacity
                                            </button>
                                        ` : ''}
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                `;
                unassignedWarning.parentNode.insertBefore(whatIfDiv, unassignedWarning);
            }
        }
        
        // Display optimization suggestions if there are unassigned locations
        if (results.suggestions && results.suggestions.length > 0) {
            const priorityColors = {
                'high': 'bg-red-50 border-red-200 text-red-800',
                'medium': 'bg-yellow-50 border-yellow-200 text-yellow-800',
                'low': 'bg-blue-50 border-blue-200 text-blue-800'
            };
            
            const suggestionsDiv = document.createElement('div');
            suggestionsDiv.className = 'bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4';
            suggestionsDiv.innerHTML = `
                <h4 class="text-blue-800 font-semibold mb-3">💡 Optimization Suggestions</h4>
                <div class="space-y-3">
                    ${results.suggestions.map(suggestion => {
                        const colorClass = priorityColors[suggestion.priority] || priorityColors['low'];
                        const actionText = getActionText(suggestion);
                        return `
                            <div class="${colorClass} border rounded-lg p-3">
                                <div class="flex items-start justify-between mb-2">
                                    <div class="font-medium">${actionText}</div>
                                    <span class="text-xs px-2 py-1 rounded uppercase font-semibold">${suggestion.priority} priority</span>
                                </div>
                                <div class="text-sm mb-2">${suggestion.reason}</div>
                                <div class="text-xs opacity-75">${suggestion.impact}</div>
                                ${suggestion.type !== 'efficiency' ? `
                                    <button onclick="applySuggestion('${suggestion.type}', ${suggestion.suggested})" 
                                            class="mt-2 px-3 py-1 bg-white border border-current rounded text-xs hover:bg-opacity-10 transition-colors">
                                        Apply Suggestion
                                    </button>
                                ` : ''}
                            </div>
                        `;
                    }).join('')}
                </div>
            `;
            unassignedWarning.parentNode.insertBefore(suggestionsDiv, unassignedWarning);
        }
        
        if (results.unassignedLocations.length > 0) {
            unassignedList.innerHTML = '';
            results.unassignedLocations.forEach(loc => {
                const li = document.createElement('li');
                li.textContent = loc;
                unassignedList.appendChild(li);
            });
            unassignedWarning.classList.remove('hidden');
        } else {
            unassignedWarning.classList.add('hidden');
        }

        // Display routes
        const routesContainer = document.getElementById('routesContainer');
        routesContainer.innerHTML = '';
        
        results.routes.forEach((route, index) => {
            const routeDiv = document.createElement('div');
            routeDiv.className = 'bg-white p-4 rounded-lg shadow-sm border border-gray-200';
            
            const title = document.createElement('h3');
            title.className = 'text-lg font-medium text-indigo-700 mb-2';
            title.textContent = `Truck ${index + 1}`;
            
            routeDiv.appendChild(title);
            
            if (route.path.length > 1) {
                const routePath = document.createElement('p');
                routePath.className = 'text-gray-700 text-sm mb-1';
                routePath.textContent = `Route: ${route.path.join(' → ')}`;
                
                const routeTime = document.createElement('p');
                routeTime.className = 'text-gray-600 text-sm';
                routeTime.textContent = `Individual Route Time: ${route.totalTime.toFixed(2)} minutes`;
                
                routeDiv.appendChild(routePath);
                routeDiv.appendChild(routeTime);
            } else {
                const noLocations = document.createElement('p');
                noLocations.className = 'text-gray-500 text-sm';
                noLocations.textContent = 'No locations assigned to this truck.';
                routeDiv.appendChild(noLocations);
            }
            
            routesContainer.appendChild(routeDiv);
        });

        document.getElementById('resultsDisplay').classList.remove('hidden');
        updateMapVisualization();
    }

    function getActionText(suggestion) {
        switch (suggestion.type) {
            case 'trucks':
                return `Increase trucks from ${suggestion.current} to ${suggestion.suggested}`;
            case 'capacity':
                return `Increase max deliveries per truck from ${suggestion.current} to ${suggestion.suggested}`;
            case 'time':
                return `Increase max travel time from ${suggestion.current} to ${suggestion.suggested} minutes`;
            case 'efficiency':
                return `Consider reducing trucks to ${suggestion.suggested} for better efficiency`;
            default:
                return 'Optimization suggestion';
        }
    }

    function applySuggestion(type, value) {
        switch (type) {
            case 'trucks':
                document.getElementById('numTrucks').value = value;
                break;
            case 'capacity':
                document.getElementById('maxCapacity').value = value;
                break;
            case 'time':
                document.getElementById('maxTravelTime').value = value;
                break;
        }
        
        // Show a brief confirmation
        showModal(`Parameter updated to ${value}. Click "Optimize Routes" to see the improved results.`);
    }

    // What-if experiments functions
    function testConfigs(baseConfig, tweaks) {
        return tweaks.map(tweak => {
            const config = {
                numTrucks: baseConfig.numTrucks + (tweak.trucks || 0),
                maxTravelTime: baseConfig.maxTravelTime + (tweak.time || 0),
                maxCapacity: baseConfig.maxCapacity + (tweak.capacity || 0)
            };
            
            // Ensure positive values
            config.numTrucks = Math.max(1, config.numTrucks);
            config.maxTravelTime = Math.max(60, config.maxTravelTime);
            config.maxCapacity = Math.max(1, config.maxCapacity);
            
            const result = simulateOROptimization(
                depot,
                selectedLocations,
                config.numTrucks,
                config.maxCapacity,
                config.maxTravelTime
            );
            
            return {
                tweak,
                config,
                unassigned: result.unassignedLocations.length,
                totalTime: result.totalTime,
                totalDistance: result.totalDistance,
                description: generateTweakDescription(baseConfig, config, tweak)
            };
        });
    }

    function pickBest(tests) {
        // prefer zero unassigned, then lowest total time
        tests.sort((a, b) => {
            if (a.unassigned !== b.unassigned)
                return a.unassigned - b.unassigned;
            return a.totalTime - b.totalTime;
        });
        return tests[0];
    }

    function generateTweakDescription(baseConfig, newConfig, tweak) {
        const changes = [];
        if (tweak.trucks) {
            changes.push(`${newConfig.numTrucks} trucks (was ${baseConfig.numTrucks})`);
        }
        if (tweak.time) {
            changes.push(`${newConfig.maxTravelTime} min max time (was ${baseConfig.maxTravelTime})`);
        }
        if (tweak.capacity) {
            changes.push(`${newConfig.maxCapacity} max deliveries (was ${baseConfig.maxCapacity})`);
        }
        return changes.join(', ');
    }

    function runWhatIfExperiments(baseConfig) {
        const tweaks = [
            { trucks: 1 },
            { time: Math.ceil(baseConfig.maxTravelTime * 0.2) },
            { capacity: 2 },
            { trucks: 1, time: Math.ceil(baseConfig.maxTravelTime * 0.1) },
            { time: Math.ceil(baseConfig.maxTravelTime * 0.5) },
            { trucks: 2 },
            { capacity: 3 },
            { trucks: 1, capacity: 1 }
        ];
        
        const tests = testConfigs(baseConfig, tweaks);
        const best = pickBest(tests);
        
        // Return top 3 suggestions that improve upon current state
        return tests
            .filter(test => test.unassigned < baseConfig.currentUnassigned || 
                          (test.unassigned === baseConfig.currentUnassigned && test.totalTime < baseConfig.currentTotalTime))
            .slice(0, 3);
    }

    function handleOptimize() {
        hideError();
        document.getElementById('resultsDisplay').classList.add('hidden');
        setLoading(true);

        const numTrucks = parseInt(document.getElementById('numTrucks').value) || 1;
        const maxCapacity = parseInt(document.getElementById('maxCapacity').value) || 1;
        const maxTravelTime = parseInt(document.getElementById('maxTravelTime').value) || 60;

        if (selectedLocations.length === 0) {
            showModal("Please select at least one delivery location.");
            setLoading(false);
            return;
        }
        if (numTrucks <= 0) {
            showModal("Number of trucks must be positive.");
            setLoading(false);
            return;
        }
        if (maxCapacity <= 0) {
            showModal("Max capacity must be positive.");
            setLoading(false);
            return;
        }
        if (maxTravelTime <= 0) {
            showModal("Max travel time must be positive.");
            setLoading(false);
            return;
        }

        try {
            const results = simulateOROptimization(
                depot,
                selectedLocations,
                numTrucks,
                maxCapacity,
                maxTravelTime
            );
            displayResults(results);
        } catch (err) {
            showError("Failed to optimize routes. Please try again.");
            console.error("Optimization error:", err);
        } finally {
            setLoading(false);
        }
    }

    // Initialize the application
    document.addEventListener('DOMContentLoaded', function() {
        populateLocationGrid();
        initializeMap();
    });

    // Expose functions still called from HTML
    window.handleOptimize = handleOptimize;
    window.applySuggestion = applySuggestion;
    window.closeModal = closeModal;
})();