# Smart Route Optimizer

A comprehensive route optimization dashboard for delivery management, featuring Google Maps integration and intelligent route planning algorithms.

## Features

- **Interactive Route Planning**: Select delivery locations from major UK cities
- **Multi-Vehicle Optimization**: Configure multiple trucks with capacity and time constraints
- **Real-time Visualization**: Google Maps integration with route visualization
- **Constraint Management**: Set maximum deliveries per truck and travel time limits
- **Modern UI**: Responsive design with Tailwind CSS
- **Route Analytics**: Detailed route information and optimization results

## Live Demo

🚀 **Try the application live:** [https://namikazi25.github.io/Route-Optimisation/](https://namikazi25.github.io/Route-Optimisation/)

The application is deployed using GitHub Pages and ready to use. Simply visit the link above to start optimizing your delivery routes!

## Setup Instructions

### 1. Google Maps API Key

Before using the application, you need to obtain a Google Maps JavaScript API key:

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the "Maps JavaScript API"
4. Create credentials (API Key)
5. Replace `YOUR_GOOGLE_MAPS_API_KEY` in `config.js` with your actual API key

```javascript
// In config.js
const GOOGLE_MAPS_API_KEY = 'your_actual_api_key_here';
```

**Important Security Note:** The `config.js` file is included in `.gitignore` to prevent accidentally committing your API key to version control. Never share your API key publicly.

### 2. Running the Application

#### Option 1: Simple File Opening
Simply open `index.html` in your web browser.

#### Option 2: Local Server (Recommended)
For better performance and to avoid CORS issues:

```bash
# Using Python (if installed)
python -m http.server 8000

# Using Node.js (if installed)
npx http-server

# Using PHP (if installed)
php -S localhost:8000
```

Then open `http://localhost:8000` in your browser.

## How to Use

### 1. Configuration
- **Depot Location**: Fixed at Birmingham (can be modified in code)
- **Number of Trucks**: Set how many vehicles are available
- **Max Deliveries per Truck**: Capacity constraint for each vehicle
- **Max Travel Time**: Time limit per truck in minutes

### 2. Location Selection
- Check the boxes for cities you want to include in delivery routes
- Available locations include major UK cities with pre-calculated distances

### 3. Route Optimization
- Click "Optimize Routes" to generate optimal delivery routes
- The algorithm considers:
  - Vehicle capacity constraints
  - Travel time limitations
  - Distance minimization
  - Return to depot requirements

### 4. Results Visualization
- **Map View**: Visual representation of routes with different colors per truck
- **Route Details**: Step-by-step route information for each vehicle
- **Performance Metrics**: Total distance and time calculations
- **Warnings**: Notifications for unassigned locations due to constraints

## Technical Details

### Algorithm
The application uses a simplified version of the Vehicle Routing Problem (VRP) solver:
- Greedy nearest-neighbor approach
- Constraint satisfaction for capacity and time
- Multi-vehicle route assignment
- Return-to-depot optimization

### Distance Matrix
Pre-calculated driving times (in minutes) between major UK cities:
- Birmingham (Depot)
- London, Manchester, Glasgow, Edinburgh
- Cardiff, Bristol, Leeds, Liverpool, Newcastle
- Sheffield, Nottingham, Southampton, Plymouth, Belfast

### Technologies Used
- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Styling**: Tailwind CSS
- **Maps**: Google Maps JavaScript API
- **Algorithm**: Custom VRP implementation

## Customization

### Adding New Locations
To add new cities, update the `distanceMatrix` object in `index.html`:

```javascript
const distanceMatrix = {
  "NewCity": {
    "lat": latitude,
    "lng": longitude,
    "Birmingham": travel_time_minutes,
    // ... distances to other cities
  }
};
```

### Modifying Constraints
- Edit default values in the HTML form inputs
- Adjust algorithm parameters in `simulateOROptimization` function
- Customize UI elements and styling

### Changing the Depot
Update the `depot` variable and ensure the new depot exists in the distance matrix.

## Browser Compatibility

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Troubleshooting

### Map Not Loading
- Verify your Google Maps API key is correct
- Check that the Maps JavaScript API is enabled in Google Cloud Console
- Ensure there are no console errors related to API quotas

### Routes Not Optimizing
- Check that at least one location is selected
- Verify constraint values are positive numbers
- Ensure selected locations are reachable within time/capacity limits

### Performance Issues
- Use a local server instead of opening the file directly
- Reduce the number of selected locations for complex optimizations
- Check browser console for JavaScript errors

## Future Enhancements

- Real-time traffic data integration
- Advanced optimization algorithms (Genetic Algorithm, Simulated Annealing)
- Export functionality for routes
- Multi-day route planning
- Driver assignment and scheduling
- Cost optimization features
- Mobile responsive improvements

## License

MIT License - feel free to modify and distribute as needed.

## Support

For technical support or feature requests, please refer to the development team or create an issue in the project repository.
