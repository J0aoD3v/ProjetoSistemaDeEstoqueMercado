package j0aod3v.sistemaestoquemercado.util;

import java.util.ArrayList;
import java.util.List;

public final class CsvUtil {

    private CsvUtil() {}

    /**
     * Detecta o separador ("," ou ";") de um texto CSV a partir da primeira linha.
     */
    public static char detectarSeparador(String conteudo) {
        String primeiraLinha = conteudo;
        int quebra = conteudo.indexOf('\n');
        if (quebra >= 0) {
            primeiraLinha = conteudo.substring(0, quebra);
        }
        long virgulas = primeiraLinha.chars().filter(ch -> ch == ',').count();
        long pontoEVirgula = primeiraLinha.chars().filter(ch -> ch == ';').count();
        return pontoEVirgula > virgulas ? ';' : ',';
    }

    /**
     * Lê todos os registros de um texto CSV respeitando aspas e valores multilinha (RFC 4180).
     */
    public static List<List<String>> lerRegistros(String conteudo, char separador) {
        if (conteudo == null || conteudo.isEmpty()) {
            return new ArrayList<>();
        }
        if (conteudo.charAt(0) == '\uFEFF') {
            conteudo = conteudo.substring(1);
        }
        List<List<String>> registros = new ArrayList<>();
        List<String> linha = new ArrayList<>();
        StringBuilder campo = new StringBuilder();
        boolean emAspas = false;
        int i = 0;
        int n = conteudo.length();
        while (i < n) {
            char c = conteudo.charAt(i);
            if (emAspas) {
                if (c == '"') {
                    if (i + 1 < n && conteudo.charAt(i + 1) == '"') {
                        campo.append('"');
                        i += 2;
                        continue;
                    }
                    emAspas = false;
                    i++;
                    continue;
                }
                campo.append(c);
                i++;
                continue;
            }
            if (c == '"') {
                emAspas = true;
                i++;
                continue;
            }
            if (c == separador) {
                linha.add(campo.toString());
                campo.setLength(0);
                i++;
                continue;
            }
            if (c == '\n') {
                linha.add(campo.toString());
                campo.setLength(0);
                registros.add(linha);
                linha = new ArrayList<>();
                i++;
                continue;
            }
            if (c == '\r') {
                i++;
                continue;
            }
            campo.append(c);
            i++;
        }
        if (campo.length() > 0 || !linha.isEmpty()) {
            linha.add(campo.toString());
            registros.add(linha);
        }
        return registros;
    }

    public static String escapar(String valor) {
        if (valor == null) {
            return "";
        }
        String s = valor.trim();
        if (s.contains(",") || s.contains(";") || s.contains("\"") || s.contains("\n") || s.contains("\r")) {
            return "\"" + s.replace("\"", "\"\"") + "\"";
        }
        return s;
    }

    public static String montarLinha(List<String> valores, char separador) {
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < valores.size(); i++) {
            if (i > 0) {
                sb.append(separador);
            }
            sb.append(escapar(valores.get(i)));
        }
        return sb.toString();
    }
}