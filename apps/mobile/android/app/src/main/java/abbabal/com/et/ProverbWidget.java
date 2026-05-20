package abbabal.com.et;

import android.app.PendingIntent;
import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.AsyncTask;
import android.widget.RemoteViews;

import org.json.JSONArray;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;

public class ProverbWidget extends AppWidgetProvider {

    private static final String API_URL = "https://abbabal-api.onrender.com/proverbs/random";
    private static final String PREFS_NAME = "ProverbWidgetPrefs";
    private static final String PREF_TEXT = "proverb_text";
    private static final String PREF_TRANSLATION = "proverb_translation";
    private static final String ACTION_REFRESH = "abbabal.com.et.WIDGET_REFRESH";

    @Override
    public void onUpdate(Context context, AppWidgetManager appWidgetManager, int[] appWidgetIds) {
        for (int appWidgetId : appWidgetIds) {
            updateWidget(context, appWidgetManager, appWidgetId, false);
        }
    }

    @Override
    public void onReceive(Context context, Intent intent) {
        super.onReceive(context, intent);
        if (ACTION_REFRESH.equals(intent.getAction())) {
            AppWidgetManager manager = AppWidgetManager.getInstance(context);
            int widgetId = intent.getIntExtra(AppWidgetManager.EXTRA_APPWIDGET_ID, -1);
            if (widgetId != -1) {
                updateWidget(context, manager, widgetId, true);
            }
        }
    }

    private void updateWidget(Context context, AppWidgetManager manager, int widgetId, boolean forceRefresh) {
        // Show cached while loading
        RemoteViews views = buildViews(context, widgetId, "Loading...", "");
        manager.updateAppWidget(widgetId, views);

        new FetchProverbTask(context, manager, widgetId).execute();
    }

    private RemoteViews buildViews(Context context, int widgetId, String text, String translation) {
        RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.proverb_widget);
        views.setTextViewText(R.id.widget_proverb_text, text);
        views.setTextViewText(R.id.widget_translation, translation);

        // Tap refresh text to get new proverb
        Intent refreshIntent = new Intent(context, ProverbWidget.class);
        refreshIntent.setAction(ACTION_REFRESH);
        refreshIntent.putExtra(AppWidgetManager.EXTRA_APPWIDGET_ID, widgetId);
        PendingIntent pendingIntent = PendingIntent.getBroadcast(
            context, widgetId, refreshIntent,
            PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
        );
        views.setOnClickPendingIntent(R.id.widget_refresh, pendingIntent);

        // Tap proverb to open app
        Intent openIntent = new Intent(context, MainActivity.class);
        PendingIntent openPending = PendingIntent.getActivity(
            context, 0, openIntent,
            PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
        );
        views.setOnClickPendingIntent(R.id.widget_proverb_text, openPending);

        return views;
    }

    private class FetchProverbTask extends AsyncTask<Void, Void, String[]> {
        private final Context context;
        private final AppWidgetManager manager;
        private final int widgetId;

        FetchProverbTask(Context context, AppWidgetManager manager, int widgetId) {
            this.context = context;
            this.manager = manager;
            this.widgetId = widgetId;
        }

        @Override
        protected String[] doInBackground(Void... voids) {
            try {
                URL url = new URL(API_URL);
                HttpURLConnection conn = (HttpURLConnection) url.openConnection();
                conn.setRequestMethod("GET");
                conn.setConnectTimeout(10000);
                conn.setReadTimeout(10000);

                BufferedReader reader = new BufferedReader(
                    new InputStreamReader(conn.getInputStream())
                );
                StringBuilder sb = new StringBuilder();
                String line;
                while ((line = reader.readLine()) != null) sb.append(line);
                reader.close();

                JSONObject json = new JSONObject(sb.toString());
                String text = json.getString("text");
                String translation = "";

                JSONArray interps = json.getJSONArray("interpretations");
                for (int i = 0; i < interps.length(); i++) {
                    JSONObject interp = interps.getJSONObject(i);
                    if ("translation".equals(interp.getString("type"))
                            && "en".equals(interp.getString("language"))
                            && interp.getBoolean("isApproved")) {
                        translation = interp.getString("content");
                        break;
                    }
                }

                // Cache it
                SharedPreferences.Editor editor = context
                    .getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE).edit();
                editor.putString(PREF_TEXT, text);
                editor.putString(PREF_TRANSLATION, translation);
                editor.apply();

                return new String[]{text, translation};

            } catch (Exception e) {
                // Return cached on failure
                SharedPreferences prefs = context
                    .getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
                return new String[]{
                    prefs.getString(PREF_TEXT, "አባባል"),
                    prefs.getString(PREF_TRANSLATION, "Amharic Proverbs")
                };
            }
        }

        @Override
        protected void onPostExecute(String[] result) {
            RemoteViews views = buildViews(context, widgetId, result[0], result[1]);
            manager.updateAppWidget(widgetId, views);
        }
    }
}