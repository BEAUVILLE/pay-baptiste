🦅 MÉMO EXPRESS — DIGIY PAY × CAISSE CENTRALE

Le paiement valide est dans payments avec status='completed', reference/transaction_ref, et un pro_id existant dans pro_accounts.

L’activation réelle des accès se fait uniquement dans pro_modules (pas ailleurs).

pro_modules.module accepte uniquement :  DRIVER, LOC, RESA, RESTO, MARKET, JOBS, BUILD, FRET_DRIVER, FRET_CLIENT, PAY (MAJUSCULE).

Toujours créer l’index unique : (pro_id, module) pour éviter les doublons.

Le workflow terrain = paiement → fonction SQL → pro_modules.

La fonction clé est cashier_activate_from_payment_ref(ref) (1 call = activation).

La fonction vérifie : paiement trouvé, completed, module valide, pro_id OK.

Elle fait un UPSERT dans pro_modules avec activated_at et expires_at (J+30).

Si un module existe avec expires_at IS NULL, ne pas l’écraser (licence illimitée).

Vérif finale : select * from pro_modules order by activated_at desc;
