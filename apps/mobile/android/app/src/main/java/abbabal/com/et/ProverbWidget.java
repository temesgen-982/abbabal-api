package abbabal.com.et;

import android.app.PendingIntent;
import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.widget.RemoteViews;

import java.io.File;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class ProverbWidget extends AppWidgetProvider {

    private static final String DB_NAME = "proverbsSQLite.db";
    private static final String PREFS_NAME = "ProverbWidgetPrefs";
    private static final String PREF_TEXT = "proverb_text";
    private static final String PREF_TRANSLATION = "proverb_translation";
    private static final String PREF_LAST_ID = "proverb_last_id";
    private static final String ACTION_REFRESH = "abbabal.com.et.WIDGET_REFRESH";

    private static final ExecutorService EXECUTOR = Executors.newSingleThreadExecutor();

    @Override
    public void onUpdate(Context context, AppWidgetManager appWidgetManager, int[] appWidgetIds) {
        for (int appWidgetId : appWidgetIds) {
            updateWidget(context, appWidgetManager, appWidgetId);
        }
    }

    @Override
    public void onReceive(Context context, Intent intent) {
        super.onReceive(context, intent);
        if (ACTION_REFRESH.equals(intent.getAction())) {
            AppWidgetManager manager = AppWidgetManager.getInstance(context);
            int widgetId = intent.getIntExtra(AppWidgetManager.EXTRA_APPWIDGET_ID, -1);
            if (widgetId != -1) {
                refreshWidget(context, manager, widgetId);
            }
        }
    }

    private void updateWidget(Context context, AppWidgetManager manager, int widgetId) {
        // First render: show a placeholder until the fetch completes.
        RemoteViews views = buildViews(context, widgetId, "አባባል", "የአማርኛ ምሳሌ", false);
        manager.updateAppWidget(widgetId, views);

        fetchAsync(context, manager, widgetId);
    }

    private void refreshWidget(Context context, AppWidgetManager manager, int widgetId) {
        // Manual refresh: keep the current proverb, just signal "loading" on the button.
        RemoteViews loading = new RemoteViews(context.getPackageName(), R.layout.proverb_widget);
        loading.setTextViewText(R.id.widget_refresh, "↻ …");
        manager.partiallyUpdateAppWidget(widgetId, loading);

        fetchAsync(context, manager, widgetId);
    }

    private void fetchAsync(Context context, AppWidgetManager manager, int widgetId) {
        EXECUTOR.execute(() -> {
            String[] result = fetchProverb(context);
            final RemoteViews updated = buildViews(context, widgetId, result[0], result[1], false);
            manager.updateAppWidget(widgetId, updated);
        });
    }

    private RemoteViews buildViews(Context context, int widgetId, String text, String translation, boolean loading) {
        RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.proverb_widget);
        views.setTextViewText(R.id.widget_refresh, loading ? "↻ …" : "↻ አዲስ");
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

    private String[] fetchProverb(Context context) {
        SharedPreferences prefs = context
            .getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
        long lastId = prefs.getLong(PREF_LAST_ID, -1);
        String cachedText = prefs.getString(PREF_TEXT, null);
        String cachedTranslation = prefs.getString(PREF_TRANSLATION, "");

        try {
            File dbFile = context.getDatabasePath(DB_NAME);
            if (!dbFile.exists()) {
                // Database not extracted yet — fall back to cached value.
                return new String[]{
                    cachedText != null ? cachedText : "አባባል",
                    cachedTranslation
                };
            }

            SQLiteDatabase db = SQLiteDatabase.openDatabase(
                dbFile.getAbsolutePath(), null,
                SQLiteDatabase.OPEN_READONLY
            );

            String[] proverb = pickRandomProverb(db, lastId);
            db.close();

            // Update cache + remember what we just showed, so refresh avoids repeats.
            prefs.edit()
                .putLong(PREF_LAST_ID, Long.parseLong(proverb[0]))
                .putString(PREF_TEXT, proverb[1])
                .putString(PREF_TRANSLATION, proverb[2])
                .apply();

            return new String[]{proverb[1], proverb[2]};

        } catch (Exception e) {
            return new String[]{
                cachedText != null ? cachedText : "አባባል",
                cachedTranslation
            };
        }
    }

    /**
     * Pick a random proverb, preferring one different from {@code lastId}.
     * Returns {id, text, translation}.
     */
    private String[] pickRandomProverb(SQLiteDatabase db, long lastId) {
        String translation = "";
        String id = "0", text = "አባባል";

        Cursor c = db.rawQuery(
            "SELECT id, text FROM proverbs WHERE " +
            (lastId >= 0 ? "id <> ? " : "1 = 1 ") +
            "ORDER BY RANDOM() LIMIT 1",
            lastId >= 0 ? new String[]{String.valueOf(lastId)} : null
        );
        if (c.moveToFirst()) {
            id = String.valueOf(c.getLong(0));
            text = c.getString(1);
        }
        c.close();

        if (id != null) {
            Cursor tc = db.rawQuery(
                "SELECT content FROM interpretations " +
                "WHERE proverb_id = ? AND type = 'translation' " +
                "AND language = 'en' AND needs_review = 0 LIMIT 1",
                new String[]{id}
            );
            if (tc.moveToFirst()) translation = tc.getString(0);
            tc.close();
        }

        return new String[]{id, text, translation};
    }
}