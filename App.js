import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  FlatList,
  StyleSheet,
  StatusBar,
  Alert,
  BackHandler,
  ActivityIndicator,
  SafeAreaView,
  Platform,
} from 'react-native';

/* =========================================================
   EDIT THESE TO CHANGE APP NAME / STUDENT DETAILS
   ========================================================= */
const APP_NAME = 'CampusGo';
const APP_TAGLINE = 'Campus Rides & Services';

const DEMO_USER = {
  name: 'Favour', // add your surname here e.g. 'Favour Okoro'
  studentId: 'LCSMT-NGA-005-ADM-1001897',
  password: 'campusgo',
  department: 'Computer Software Engineering',
  school: 'Lincoln College of Science Management and Technology',
};

const START_BALANCE = 3500;
const START_COMPLETED_RIDES = 6;

/* =========================================================
   THEME
   ========================================================= */
const C = {
  ink: '#10233F',
  inkSoft: '#1B3358',
  yellow: '#FFC72C',
  yellowDark: '#E5A800',
  paper: '#F3F5F8',
  card: '#FFFFFF',
  line: '#E1E6ED',
  grey: '#5F6F85',
  green: '#1E9E6A',
  red: '#C8383A',
};

/* =========================================================
   DATA
   ========================================================= */
const INITIAL_RIDES = [
  { id: 'r1', from: 'Main Gate', to: 'Science Block', time: '07:30 AM', price: 200, seats: 6 },
  { id: 'r2', from: 'Hostel A', to: 'Library', time: '08:00 AM', price: 150, seats: 4 },
  { id: 'r3', from: 'Library', to: 'Cafeteria', time: '12:15 PM', price: 100, seats: 8 },
  { id: 'r4', from: 'Engineering Block', to: 'Main Gate', time: '02:00 PM', price: 200, seats: 3 },
  { id: 'r5', from: 'Cafeteria', to: 'Hostel B', time: '04:30 PM', price: 150, seats: 5 },
  { id: 'r6', from: 'Main Gate', to: 'Sports Complex', time: '05:00 PM', price: 250, seats: 7 },
  { id: 'r7', from: 'Hostel B', to: 'Admin Block', time: '07:45 AM', price: 150, seats: 2 },
];

// [state, capital, latitude, longitude]
const STATES = [
  ['Abia State', 'Umuahia', 5.53, 7.49],
  ['Adamawa State', 'Yola', 9.2, 12.48],
  ['Akwa Ibom State', 'Uyo', 5.05, 7.93],
  ['Anambra State', 'Awka', 6.21, 7.07],
  ['Bauchi State', 'Bauchi', 10.31, 9.84],
  ['Bayelsa State', 'Yenagoa', 4.92, 6.26],
  ['Benue State', 'Makurdi', 7.73, 8.52],
  ['Borno State', 'Maiduguri', 11.83, 13.15],
  ['Cross River State', 'Calabar', 4.96, 8.33],
  ['Delta State', 'Asaba', 6.2, 6.73],
  ['Ebonyi State', 'Abakaliki', 6.32, 8.11],
  ['Edo State', 'Benin City', 6.34, 5.63],
  ['Ekiti State', 'Ado-Ekiti', 7.62, 5.22],
  ['Enugu State', 'Enugu', 6.46, 7.55],
  ['FCT', 'Abuja', 9.06, 7.49],
  ['Gombe State', 'Gombe', 10.29, 11.17],
  ['Imo State', 'Owerri', 5.48, 7.03],
  ['Jigawa State', 'Dutse', 11.76, 9.34],
  ['Kaduna State', 'Kaduna', 10.52, 7.44],
  ['Kano State', 'Kano', 12.0, 8.52],
  ['Katsina State', 'Katsina', 12.99, 7.6],
  ['Kebbi State', 'Birnin Kebbi', 12.45, 4.2],
  ['Kogi State', 'Lokoja', 7.8, 6.74],
  ['Kwara State', 'Ilorin', 8.5, 4.55],
  ['Lagos State', 'Ikeja', 6.6, 3.35],
  ['Nasarawa State', 'Lafia', 8.49, 8.52],
  ['Niger State', 'Minna', 9.61, 6.55],
  ['Ogun State', 'Abeokuta', 7.16, 3.35],
  ['Ondo State', 'Akure', 7.25, 5.19],
  ['Osun State', 'Osogbo', 7.77, 4.56],
  ['Oyo State', 'Ibadan', 7.38, 3.95],
  ['Plateau State', 'Jos', 9.92, 8.89],
  ['Rivers State', 'Port Harcourt', 4.82, 7.03],
  ['Sokoto State', 'Sokoto', 13.06, 5.24],
  ['Taraba State', 'Jalingo', 8.89, 11.36],
  ['Yobe State', 'Damaturu', 11.75, 11.96],
  ['Zamfara State', 'Gusau', 12.17, 6.66],
].map(([name, capital, lat, lon]) => ({ name, capital, lat, lon }));

const weatherLabel = (code) => {
  if (code === 0) return 'Clear Sky';
  if (code === 1 || code === 2) return 'Partly Cloudy';
  if (code === 3) return 'Overcast';
  if (code === 45 || code === 48) return 'Foggy';
  if (code >= 51 && code <= 57) return 'Drizzle';
  if (code >= 61 && code <= 67) return 'Rain';
  if (code >= 80 && code <= 82) return 'Rain Showers';
  if (code >= 95) return 'Thunderstorm';
  return 'Cloudy';
};

const weatherEmoji = (code) => {
  if (code === 0) return '☀️';
  if (code === 1 || code === 2) return '⛅';
  if (code === 3) return '☁️';
  if (code === 45 || code === 48) return '🌫️';
  if (code >= 51 && code <= 67) return '🌦️';
  if (code >= 80 && code <= 82) return '🌧️';
  if (code >= 95) return '⛈️';
  return '☁️';
};

const naira = (n) => '₦' + Number(n).toLocaleString('en-NG');

/* =========================================================
   SMALL SHARED COMPONENTS
   ========================================================= */
function Header({ title, onBack, onMenu }) {
  return (
    <View style={s.header}>
      <TouchableOpacity onPress={onBack} style={s.headerBtn}>
        <Text style={s.headerBtnText}>‹ Back</Text>
      </TouchableOpacity>
      <Text style={s.headerTitle}>{title}</Text>
      <TouchableOpacity onPress={onMenu} style={s.headerBtn}>
        <Text style={[s.headerBtnText, { textAlign: 'right' }]}>Menu</Text>
      </TouchableOpacity>
    </View>
  );
}

/* =========================================================
   SCREENS
   ========================================================= */
function SplashScreen({ onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2500);
    return () => clearTimeout(t);
  }, []);

  return (
    <View style={s.splash}>
      <View style={s.splashBadge}>
        <Text style={s.splashBadgeText}>🚌</Text>
      </View>
      <Text style={s.splashTitle}>{APP_NAME}</Text>
      <Text style={s.splashTag}>{APP_TAGLINE}</Text>
      <ActivityIndicator color={C.yellow} size="large" style={{ marginTop: 36 }} />
    </View>
  );
}

function LoginScreen({ onLogin }) {
  const [id, setId] = useState('');
  const [pw, setPw] = useState('');
  const [show, setShow] = useState(false);

  const submit = () => {
    if (!id.trim() || !pw) {
      Alert.alert('Missing details', 'Enter your Student ID and password.');
      return;
    }
    if (
      id.trim().toLowerCase() === DEMO_USER.studentId.toLowerCase() &&
      pw === DEMO_USER.password
    ) {
      onLogin();
    } else {
      Alert.alert('Login failed', 'Student ID or password is incorrect.');
    }
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: C.paper }}
      contentContainerStyle={{ flexGrow: 1 }}
      keyboardShouldPersistTaps="handled"
    >
      <View style={s.loginTop}>
        <Text style={s.loginLogo}>🚌</Text>
        <Text style={s.loginBrand}>{APP_NAME}</Text>
        <Text style={s.loginSub}>Sign in with your student account to book rides and check weather.</Text>
      </View>

      <View style={s.loginSheet}>
        <Text style={s.label}>Student ID</Text>
        <TextInput
          style={s.input}
          placeholder="LCSMT-NGA-000-ADM-0000000"
          placeholderTextColor="#98A3B3"
          value={id}
          onChangeText={setId}
          autoCapitalize="characters"
          autoCorrect={false}
        />

        <Text style={[s.label, { marginTop: 16 }]}>Password</Text>
        <View style={s.inputRow}>
          <TextInput
            style={[s.input, { flex: 1, borderWidth: 0, marginBottom: 0 }]}
            placeholder="Enter password"
            placeholderTextColor="#98A3B3"
            secureTextEntry={!show}
            value={pw}
            onChangeText={setPw}
            autoCapitalize="none"
          />
          <TouchableOpacity onPress={() => setShow(!show)} style={{ paddingHorizontal: 14 }}>
            <Text style={{ color: C.ink, fontWeight: '700' }}>{show ? 'Hide' : 'Show'}</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={s.primaryBtn} onPress={submit} activeOpacity={0.85}>
          <Text style={s.primaryBtnText}>Log in</Text>
        </TouchableOpacity>

        <View style={s.demoBox}>
          <Text style={s.demoTitle}>Demo account</Text>
          <Text style={s.demoLine}>Student ID: {DEMO_USER.studentId}</Text>
          <Text style={s.demoLine}>Password: {DEMO_USER.password}</Text>
          <TouchableOpacity
            onPress={() => {
              setId(DEMO_USER.studentId);
              setPw(DEMO_USER.password);
            }}
          >
            <Text style={s.demoFill}>Fill demo details</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

function MenuScreen({ go, onExit }) {
  const tiles = [
    { key: 'dashboard', icon: '📊', title: 'Dashboard', sub: 'Overview, active rides & balance' },
    { key: 'rides', icon: '🚌', title: 'Find a Ride', sub: 'Search & book campus shuttles' },
    { key: 'weather', icon: '🌤️', title: 'Nigeria Weather', sub: '36 states, FCT & capitals forecast' },
    { key: 'profile', icon: '👤', title: 'User Profile', sub: 'Student ID, history & preferences' },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: C.paper }}>
      <View style={s.menuHero}>
        <Text style={s.menuHello}>Welcome, {DEMO_USER.name}</Text>
        <Text style={s.menuBrand}>{APP_NAME}</Text>
        <Text style={s.menuTag}>{APP_TAGLINE}</Text>
      </View>

      <View style={s.grid}>
        {tiles.map((t) => (
          <TouchableOpacity key={t.key} style={s.tile} activeOpacity={0.85} onPress={() => go(t.key)}>
            <Text style={s.tileIcon}>{t.icon}</Text>
            <Text style={s.tileTitle}>{t.title}</Text>
            <Text style={s.tileSub}>{t.sub}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={s.exitBtn} onPress={onExit} activeOpacity={0.85}>
        <Text style={s.exitBtnText}>Exit application</Text>
      </TouchableOpacity>
    </View>
  );
}

function DashboardScreen({ balance, activeRides, completed, onTopUp, onCancel, go }) {
  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
      <View style={s.balanceCard}>
        <Text style={s.balanceLabel}>Wallet balance</Text>
        <Text style={s.balanceValue}>{naira(balance)}</Text>
        <TouchableOpacity style={s.topUpBtn} onPress={onTopUp}>
          <Text style={s.topUpText}>+ Add ₦1,000</Text>
        </TouchableOpacity>
      </View>

      <View style={s.statRow}>
        <View style={s.statBox}>
          <Text style={s.statNum}>{activeRides.length}</Text>
          <Text style={s.statLabel}>Active rides</Text>
        </View>
        <View style={s.statBox}>
          <Text style={s.statNum}>{completed}</Text>
          <Text style={s.statLabel}>Completed</Text>
        </View>
      </View>

      <Text style={s.sectionTitle}>Active rides</Text>
      {activeRides.length === 0 ? (
        <View style={s.emptyBox}>
          <Text style={s.emptyText}>No active rides. Reserve a seat on Find a Ride and it will appear here.</Text>
          <TouchableOpacity style={s.smallBtn} onPress={() => go('rides')}>
            <Text style={s.smallBtnText}>Find a ride</Text>
          </TouchableOpacity>
        </View>
      ) : (
        activeRides.map((r) => (
          <View key={r.bookingId} style={s.rideCard}>
            <View style={{ flex: 1 }}>
              <Text style={s.rideRoute}>
                {r.from} → {r.to}
              </Text>
              <Text style={s.rideMeta}>
                {r.time} • {naira(r.price)}
              </Text>
            </View>
            <TouchableOpacity onPress={() => onCancel(r)} style={s.cancelBtn}>
              <Text style={s.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        ))
      )}
    </ScrollView>
  );
}

function RidesScreen({ rides, balance, onBook }) {
  const [query, setQuery] = useState('');
  const q = query.trim().toLowerCase();
  const filtered = rides.filter(
    (r) => !q || r.from.toLowerCase().includes(q) || r.to.toLowerCase().includes(q)
  );

  return (
    <View style={{ flex: 1 }}>
      <View style={{ padding: 16, paddingBottom: 8 }}>
        <TextInput
          style={s.search}
          placeholder="Search by pickup or destination"
          placeholderTextColor="#98A3B3"
          value={query}
          onChangeText={setQuery}
        />
        <Text style={s.walletHint}>Wallet: {naira(balance)}</Text>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(r) => r.id}
        contentContainerStyle={{ padding: 16, paddingTop: 4, paddingBottom: 40 }}
        ListEmptyComponent={
          <View style={s.emptyBox}>
            <Text style={s.emptyText}>No shuttles match "{query}". Try another location.</Text>
          </View>
        }
        renderItem={({ item }) => {
          const full = item.seats === 0;
          return (
            <View style={s.rideCard}>
              <View style={{ flex: 1 }}>
                <Text style={s.rideRoute}>
                  {item.from} → {item.to}
                </Text>
                <Text style={s.rideMeta}>
                  {item.time} • {naira(item.price)} • {item.seats} seat{item.seats === 1 ? '' : 's'} left
                </Text>
              </View>
              <TouchableOpacity
                disabled={full}
                onPress={() => onBook(item)}
                style={[s.bookBtn, full && { backgroundColor: C.line }]}
              >
                <Text style={[s.bookText, full && { color: C.grey }]}>{full ? 'Full' : 'Book'}</Text>
              </TouchableOpacity>
            </View>
          );
        }}
      />
    </View>
  );
}

function WeatherScreen() {
  const [selected, setSelected] = useState(STATES.find((x) => x.name === 'FCT'));
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = useCallback(async (place) => {
    setLoading(true);
    setError(false);
    try {
      const url =
        'https://api.open-meteo.com/v1/forecast?latitude=' +
        place.lat +
        '&longitude=' +
        place.lon +
        '&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code';
      const res = await fetch(url);
      const json = await res.json();
      setData({
        temp: Math.round(json.current.temperature_2m),
        humidity: json.current.relative_humidity_2m,
        wind: json.current.wind_speed_10m,
        code: json.current.weather_code,
      });
    } catch (e) {
      setError(true);
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load(selected);
  }, [selected]);

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={STATES}
        keyExtractor={(x) => x.name}
        contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
        ListHeaderComponent={
          <View>
            <View style={s.weatherCard}>
              <Text style={s.weatherPlace}>{selected.name}</Text>
              <Text style={s.weatherCap}>Capital: {selected.capital}, Nigeria</Text>

              {loading ? (
                <ActivityIndicator color={C.yellow} size="large" style={{ marginVertical: 40 }} />
              ) : error || !data ? (
                <View style={{ paddingVertical: 24 }}>
                  <Text style={s.weatherError}>Could not load weather. Check your internet connection.</Text>
                  <TouchableOpacity style={s.smallBtn} onPress={() => load(selected)}>
                    <Text style={s.smallBtnText}>Try again</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <>
                  <Text style={s.weatherEmoji}>{weatherEmoji(data.code)}</Text>
                  <Text style={s.weatherTemp}>{data.temp}°C</Text>
                  <Text style={s.weatherDesc}>{weatherLabel(data.code)}</Text>
                  <View style={s.weatherDivider} />
                  <View style={s.weatherStats}>
                    <View style={s.weatherStat}>
                      <Text style={s.weatherStatLabel}>Wind speed</Text>
                      <Text style={s.weatherStatValue}>{data.wind} km/h</Text>
                    </View>
                    <View style={s.weatherStat}>
                      <Text style={s.weatherStatLabel}>Humidity</Text>
                      <Text style={s.weatherStatValue}>{data.humidity}%</Text>
                    </View>
                  </View>
                </>
              )}
            </View>
            <Text style={s.sectionTitle}>Select state / capital</Text>
          </View>
        }
        renderItem={({ item }) => {
          const active = item.name === selected.name;
          return (
            <TouchableOpacity
              style={[s.stateRow, active && s.stateRowActive]}
              onPress={() => setSelected(item)}
              activeOpacity={0.8}
            >
              <Text style={[s.stateName, active && { color: C.ink }]}>{item.name}</Text>
              <Text style={s.stateCap}>Capital: {item.capital}</Text>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

function ProfileScreen({ balance, completed, history, onSignOut }) {
  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
      <View style={s.profileCard}>
        <View style={s.avatar}>
          <Text style={s.avatarText}>{DEMO_USER.name.charAt(0).toUpperCase()}</Text>
        </View>
        <Text style={s.profileName}>{DEMO_USER.name}</Text>
        <Text style={s.profileId}>{DEMO_USER.studentId}</Text>
        <Text style={s.profileDept}>{DEMO_USER.department}</Text>
      </View>

      <View style={s.infoCard}>
        <Text style={s.infoTitle}>Account statistics</Text>
        <View style={s.infoRow}>
          <Text style={s.infoKey}>Wallet balance</Text>
          <Text style={s.infoVal}>{naira(balance)}</Text>
        </View>
        <View style={s.infoRow}>
          <Text style={s.infoKey}>Rides completed</Text>
          <Text style={s.infoVal}>{completed}</Text>
        </View>
        <View style={s.infoRow}>
          <Text style={s.infoKey}>Account status</Text>
          <Text style={[s.infoVal, { color: C.green }]}>Verified student</Text>
        </View>
      </View>

      <Text style={s.sectionTitle}>Recent ride history</Text>
      {history.length === 0 ? (
        <View style={s.emptyBox}>
          <Text style={s.emptyText}>No rides booked yet. Reserve a seat on the Find a Ride screen and it will show up here.</Text>
        </View>
      ) : (
        history.map((r) => (
          <View key={r.bookingId} style={s.rideCard}>
            <View style={{ flex: 1 }}>
              <Text style={s.rideRoute}>
                {r.from} → {r.to}
              </Text>
              <Text style={s.rideMeta}>
                {r.time} • {naira(r.price)}
              </Text>
            </View>
            <Text style={[s.statusPill, r.status === 'Cancelled' && { color: C.red }]}>{r.status}</Text>
          </View>
        ))
      )}

      <TouchableOpacity style={s.signOutBtn} onPress={onSignOut} activeOpacity={0.85}>
        <Text style={s.signOutText}>Sign out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

/* =========================================================
   ROOT APP
   ========================================================= */
export default function App() {
  const [screen, setScreen] = useState('splash'); // splash | login | menu | dashboard | rides | weather | profile
  const [balance, setBalance] = useState(START_BALANCE);
  const [completed] = useState(START_COMPLETED_RIDES);
  const [rides, setRides] = useState(INITIAL_RIDES);
  const [history, setHistory] = useState([]); // every booking, newest first

  const activeRides = history.filter((h) => h.status === 'Booked');

  const confirmExit = () => {
    Alert.alert(
      'Exit ' + APP_NAME,
      'Do you want to close the app?',
      [
        { text: 'Stay', style: 'cancel' },
        { text: 'Exit', onPress: () => BackHandler.exitApp() },
      ],
      { cancelable: true }
    );
  };

  // Android hardware back button
  const screenRef = useRef(screen);
  screenRef.current = screen;
  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      const cur = screenRef.current;
      if (cur === 'splash') return true;
      if (cur === 'login') {
        confirmExit();
        return true;
      }
      if (cur === 'menu') {
        confirmExit();
        return true;
      }
      setScreen('menu');
      return true;
    });
    return () => sub.remove();
  }, []);

  const bookRide = (ride) => {
    if (balance < ride.price) {
      Alert.alert('Insufficient balance', 'You need ' + naira(ride.price - balance) + ' more. Add funds from the Dashboard.');
      return;
    }
    Alert.alert(
      'Confirm booking',
      ride.from + ' → ' + ride.to + '\n' + ride.time + '\nFare: ' + naira(ride.price),
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Book seat',
          onPress: () => {
            setBalance((b) => b - ride.price);
            setRides((list) => list.map((r) => (r.id === ride.id ? { ...r, seats: r.seats - 1 } : r)));
            setHistory((h) => [
              { ...ride, bookingId: 'b' + Date.now(), status: 'Booked' },
              ...h,
            ]);
            Alert.alert('Seat reserved', 'Your ride is on the Dashboard.');
          },
        },
      ]
    );
  };

  const cancelRide = (booking) => {
    Alert.alert('Cancel ride', 'Cancel this booking and get ' + naira(booking.price) + ' back?', [
      { text: 'Keep ride', style: 'cancel' },
      {
        text: 'Cancel ride',
        style: 'destructive',
        onPress: () => {
          setBalance((b) => b + booking.price);
          setRides((list) => list.map((r) => (r.id === booking.id ? { ...r, seats: r.seats + 1 } : r)));
          setHistory((h) => h.map((x) => (x.bookingId === booking.bookingId ? { ...x, status: 'Cancelled' } : x)));
        },
      },
    ]);
  };

  const signOut = () => {
    Alert.alert('Sign out', 'Do you want to sign out?', [
      { text: 'Stay', style: 'cancel' },
      { text: 'Sign out', onPress: () => setScreen('login') },
    ]);
  };

  const titles = {
    dashboard: 'Dashboard',
    rides: 'Find a Ride',
    weather: 'Nigeria Weather',
    profile: 'User Profile',
  };

  let body = null;
  if (screen === 'splash') body = <SplashScreen onDone={() => setScreen('login')} />;
  else if (screen === 'login') body = <LoginScreen onLogin={() => setScreen('menu')} />;
  else if (screen === 'menu') body = <MenuScreen go={setScreen} onExit={confirmExit} />;
  else {
    body = (
      <View style={{ flex: 1, backgroundColor: C.paper }}>
        <Header title={titles[screen]} onBack={() => setScreen('menu')} onMenu={() => setScreen('menu')} />
        {screen === 'dashboard' && (
          <DashboardScreen
            balance={balance}
            activeRides={activeRides}
            completed={completed}
            onTopUp={() => setBalance((b) => b + 1000)}
            onCancel={cancelRide}
            go={setScreen}
          />
        )}
        {screen === 'rides' && <RidesScreen rides={rides} balance={balance} onBook={bookRide} />}
        {screen === 'weather' && <WeatherScreen />}
        {screen === 'profile' && (
          <ProfileScreen balance={balance} completed={completed} history={history} onSignOut={signOut} />
        )}
      </View>
    );
  }

  const darkScreen = screen === 'splash';
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: darkScreen ? C.ink : screen === 'menu' ? C.ink : C.ink }}>
      <StatusBar barStyle="light-content" backgroundColor={C.ink} />
      {body}
    </SafeAreaView>
  );
}

/* =========================================================
   STYLES
   ========================================================= */
const s = StyleSheet.create({
  /* splash */
  splash: { flex: 1, backgroundColor: C.ink, alignItems: 'center', justifyContent: 'center', padding: 24 },
  splashBadge: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: C.yellow,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  splashBadgeText: { fontSize: 44 },
  splashTitle: { color: '#fff', fontSize: 38, fontWeight: '800', letterSpacing: 0.5 },
  splashTag: { color: '#A9B8CF', fontSize: 15, marginTop: 8 },

  /* login */
  loginTop: { backgroundColor: C.ink, paddingTop: 48, paddingBottom: 56, paddingHorizontal: 24 },
  loginLogo: { fontSize: 40, marginBottom: 12 },
  loginBrand: { color: C.yellow, fontSize: 34, fontWeight: '800' },
  loginSub: { color: '#C5D0E0', fontSize: 15, marginTop: 10, lineHeight: 22 },
  loginSheet: {
    flex: 1,
    backgroundColor: C.paper,
    marginTop: -28,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
  },
  label: { color: C.ink, fontWeight: '700', marginBottom: 8, fontSize: 14 },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: C.line,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: Platform.OS === 'ios' ? 14 : 11,
    fontSize: 15,
    color: C.ink,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: C.line,
    borderRadius: 12,
  },
  primaryBtn: {
    backgroundColor: C.yellow,
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 24,
  },
  primaryBtnText: { color: C.ink, fontWeight: '800', fontSize: 16 },
  demoBox: {
    marginTop: 24,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#B7C1D0',
  },
  demoTitle: { color: C.ink, fontWeight: '700', marginBottom: 6 },
  demoLine: { color: C.grey, fontSize: 13, marginTop: 2 },
  demoFill: { color: C.ink, fontWeight: '700', marginTop: 10, textDecorationLine: 'underline' },

  /* menu */
  menuHero: { backgroundColor: C.ink, paddingHorizontal: 24, paddingTop: 28, paddingBottom: 36 },
  menuHello: { color: '#A9B8CF', fontSize: 14 },
  menuBrand: { color: C.yellow, fontSize: 32, fontWeight: '800', marginTop: 4 },
  menuTag: { color: '#fff', fontSize: 14, marginTop: 2 },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginTop: 16,
  },
  tile: {
    width: '48%',
    backgroundColor: C.card,
    borderRadius: 18,
    padding: 16,
    minHeight: 150,
    marginBottom: 14,
    borderBottomWidth: 4,
    borderBottomColor: C.yellow,
  },
  tileIcon: { fontSize: 30, marginBottom: 10 },
  tileTitle: { color: C.ink, fontWeight: '800', fontSize: 16 },
  tileSub: { color: C.grey, fontSize: 12, marginTop: 4, lineHeight: 17 },
  exitBtn: {
    marginHorizontal: 16,
    marginTop: 4,
    paddingVertical: 15,
    borderRadius: 14,
    backgroundColor: C.red,
    alignItems: 'center',
  },
  exitBtnText: { color: '#fff', fontWeight: '800', fontSize: 15 },

  /* header */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.ink,
    paddingHorizontal: 12,
    paddingVertical: 14,
  },
  headerBtn: { width: 70 },
  headerBtnText: { color: C.yellow, fontWeight: '700', fontSize: 15 },
  headerTitle: { flex: 1, textAlign: 'center', color: '#fff', fontWeight: '800', fontSize: 17 },

  /* shared */
  sectionTitle: { color: C.ink, fontSize: 17, fontWeight: '800', marginTop: 20, marginBottom: 10 },
  emptyBox: { backgroundColor: C.card, borderRadius: 14, padding: 16, borderWidth: 1, borderColor: C.line },
  emptyText: { color: C.grey, fontSize: 14, lineHeight: 20 },
  smallBtn: {
    alignSelf: 'flex-start',
    backgroundColor: C.ink,
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 10,
    marginTop: 12,
  },
  smallBtnText: { color: '#fff', fontWeight: '700' },

  /* dashboard */
  balanceCard: { backgroundColor: C.ink, borderRadius: 20, padding: 20 },
  balanceLabel: { color: '#A9B8CF', fontSize: 13 },
  balanceValue: { color: C.yellow, fontSize: 38, fontWeight: '800', marginTop: 4 },
  topUpBtn: {
    alignSelf: 'flex-start',
    marginTop: 14,
    backgroundColor: C.yellow,
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 10,
  },
  topUpText: { color: C.ink, fontWeight: '800' },
  statRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 14 },
  statBox: {
    width: '48.5%',
    backgroundColor: C.card,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: C.line,
  },
  statNum: { color: C.ink, fontSize: 28, fontWeight: '800' },
  statLabel: { color: C.grey, fontSize: 13, marginTop: 2 },

  /* rides */
  search: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: C.line,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: Platform.OS === 'ios' ? 13 : 10,
    fontSize: 15,
    color: C.ink,
  },
  walletHint: { color: C.grey, fontSize: 13, marginTop: 8 },
  rideCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.card,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: C.line,
    borderLeftWidth: 5,
    borderLeftColor: C.yellow,
  },
  rideRoute: { color: C.ink, fontWeight: '800', fontSize: 15 },
  rideMeta: { color: C.grey, fontSize: 13, marginTop: 4 },
  bookBtn: { backgroundColor: C.ink, paddingHorizontal: 18, paddingVertical: 9, borderRadius: 10 },
  bookText: { color: C.yellow, fontWeight: '800' },
  cancelBtn: { paddingHorizontal: 12, paddingVertical: 8 },
  cancelText: { color: C.red, fontWeight: '700' },
  statusPill: { color: C.green, fontWeight: '800', fontSize: 13 },

  /* weather */
  weatherCard: { backgroundColor: C.ink, borderRadius: 22, padding: 22, alignItems: 'center' },
  weatherPlace: { color: '#fff', fontSize: 26, fontWeight: '800' },
  weatherCap: { color: '#A9B8CF', fontSize: 13, marginTop: 4 },
  weatherEmoji: { fontSize: 46, marginTop: 16 },
  weatherTemp: { color: C.yellow, fontSize: 60, fontWeight: '800', marginTop: 4 },
  weatherDesc: { color: '#fff', fontSize: 17, fontWeight: '600', marginTop: 2 },
  weatherDivider: { height: 1, backgroundColor: '#2C4468', alignSelf: 'stretch', marginVertical: 18 },
  weatherStats: { flexDirection: 'row', alignSelf: 'stretch', justifyContent: 'space-around' },
  weatherStat: { alignItems: 'center' },
  weatherStatLabel: { color: '#A9B8CF', fontSize: 12 },
  weatherStatValue: { color: '#fff', fontSize: 17, fontWeight: '800', marginTop: 4 },
  weatherError: { color: '#FFB4B4', textAlign: 'center', fontSize: 14 },
  stateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: C.card,
    borderRadius: 12,
    padding: 15,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: C.line,
  },
  stateRowActive: { backgroundColor: '#FFF4D1', borderColor: C.yellow },
  stateName: { color: C.ink, fontWeight: '700', fontSize: 15 },
  stateCap: { color: C.grey, fontSize: 13 },

  /* profile */
  profileCard: { backgroundColor: C.card, borderRadius: 20, padding: 22, alignItems: 'center', borderWidth: 1, borderColor: C.line },
  avatar: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: C.yellow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: C.ink, fontSize: 36, fontWeight: '800' },
  profileName: { color: C.ink, fontSize: 22, fontWeight: '800', marginTop: 12 },
  profileId: { color: C.inkSoft, fontSize: 13, fontWeight: '700', marginTop: 6, textAlign: 'center' },
  profileDept: { color: C.grey, fontSize: 14, marginTop: 4, textAlign: 'center' },
  infoCard: { backgroundColor: C.card, borderRadius: 18, padding: 18, marginTop: 14, borderWidth: 1, borderColor: C.line },
  infoTitle: { color: C.ink, fontWeight: '800', fontSize: 16, marginBottom: 6 },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 11,
    borderTopWidth: 1,
    borderTopColor: C.line,
  },
  infoKey: { color: C.grey, fontSize: 14 },
  infoVal: { color: C.ink, fontWeight: '800', fontSize: 14 },
  signOutBtn: {
    marginTop: 24,
    backgroundColor: C.red,
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
  },
  signOutText: { color: '#fff', fontWeight: '800', fontSize: 15 },
});
