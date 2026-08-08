import { FC } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { useTranslation } from '@/shared/lib/i18n';
import { colors } from '@/shared/theme';

interface AgreementTextProps {
  i18nKey: string;
  onLinkPress: () => void;
}

/**
 * Renders a consent line whose translation embeds a single `<link>…</link>`
 * span pointing at the document it refers to.
 */
export const AgreementText: FC<AgreementTextProps> = ({
  i18nKey,
  onLinkPress,
}) => {
  const { t } = useTranslation();
  const raw = t(i18nKey);
  const match = raw.match(/^(.*?)<link>(.*?)<\/link>(.*)$/s);

  if (!match) {
    return <Text style={styles.text}>{raw}</Text>;
  }

  const [, before, linkText, after] = match;
  return (
    <View style={styles.agreementText}>
      {before ? <Text style={styles.text}>{before}</Text> : null}
      <TouchableOpacity activeOpacity={0.7} onPress={onLinkPress}>
        <Text style={styles.link}>{linkText}</Text>
      </TouchableOpacity>
      {after ? <Text style={styles.text}>{after}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  agreementText: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  text: {
    fontSize: 12,
    color: colors.textMain,
  },
  link: {
    fontSize: 12,
    color: colors.primary,
    textDecorationLine: 'underline',
  },
});
